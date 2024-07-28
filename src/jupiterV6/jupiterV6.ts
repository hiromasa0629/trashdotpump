import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import fetch from "cross-fetch";
import Wallet from "@coral-xyz/anchor/dist/cjs/nodewallet"
import bs58 from "bs58";
import { getSignature } from "./getSignature";
import { transactionSenderAndConfirmationWaiter } from "./transactionSender";
import { Buffer } from 'buffer';
import mywallet from "../keypair.json";

const connection = new Connection(
  ""
);
const wallet = new Wallet(
  Keypair.fromSecretKey(
    bs58.decode(
      process.env.PRIVATE_KEY ||
        mywallet.privateKey
    )
  )
);

export async function getQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number,
  dexes: string
) {
  try {
    let params = [
      `inputMint=${inputMint}`,
      `outputMint=${outputMint}`,
      `amount=${amount}`,
      `slippageBps=${slippageBps}`,
    ];

    if (dexes !== "") {
      params.push(`dexes=${dexes}`);
    }
    const queryString = params.join("&");
    const response = await fetch(
      `https://quote-api.jup.ag/v6/quote?${queryString}`
    );
    const quoteResponse = await response.json();
    console.log(quoteResponse, quoteResponse.routePlan)
    return quoteResponse;
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
  return null;
}

async function getSwapTransaction(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number,
  dexes: string,
  computeFee: number,
  prioritizationFee: number,
  jitoTipFee: number // sadly not enough time to implement jito tipping
) {
  const quoteResponse = await getQuote(
    inputMint,
    outputMint,
    amount,
    slippageBps,
    dexes
  );
  if (!quoteResponse) {
    console.error("No quote response");
    return null;
  }

  const body: any = {
    quoteResponse: quoteResponse,
    userPublicKey: wallet.publicKey.toString(),
    wrapAndUnwrapSol: true,
  };
  
  if (prioritizationFee === 0) {
    body.computeUnitPriceMicroLamports = computeFee || "auto";
  } else {
    body.prioritizationFeeLamports = prioritizationFee;
  }

  // Jito tip integration soon

  const response = await fetch("https://quote-api.jup.ag/v6/swap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const { swapTransaction } = await response.json();
  return swapTransaction;
}

export async function jupiterV6Swap(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number,
  dexes: string,
  computeFee: number,
  prioritizationFee: number,
  jitoTipFee: number
) {
  try {
    const swapTransaction = await getSwapTransaction(
      inputMint,
      outputMint,
      amount,
      slippageBps,
      dexes,
      computeFee,
      prioritizationFee,
      jitoTipFee
    );
    if (swapTransaction) {
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      transaction.sign([wallet.payer]);
      const signature = getSignature(transaction);

      console.log(`https://solscan.io/tx/${signature}`);

      const { value: simulatedTransactionResponse } =
        await connection.simulateTransaction(transaction, {
          replaceRecentBlockhash: true,
          commitment: "processed",
        });
      const { err, logs } = simulatedTransactionResponse;

      if (err) {
        console.error("Simulation Error:");
        console.error({ err, logs });
        return;
      }

      const serializedTransaction = Buffer.from(transaction.serialize());
      const blockhash = transaction.message.recentBlockhash;

      const latestBlockHash = await connection.getLatestBlockhash();

      const transactionResponse = await transactionSenderAndConfirmationWaiter({
        connection,
        serializedTransaction,
        blockhashWithExpiryBlockHeight: {
          blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        },
      });

      if (!transactionResponse) {
        console.error("Transaction not confirmed");
        return;
      }
      return signature;
    }
  } catch (error) {
    console.error("Error getting swap transaction:", error);
  }
}