import {
  PublicKey,
  Connection,
  Transaction,
  SystemProgram,
  ComputeBudgetProgram,
  ParsedAccountData,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import "dotenv/config";
import { getEstimatedTokenReceive, getEstimatedSolReceive } from "./utils";
import * as splToken from "@solana/spl-token";

const connection = new Connection(
  ""
);

const LP_PUB_KEY = new PublicKey(
  "2M2R9CqTFQvmuxbGtjodxW8nioPNiV4zWKxFi8VeWCkg"
);

const data = fs.readFileSync("keypair.json", "utf8");
const keypairJSON = JSON.parse(data);
const privateKey = new Uint8Array(bs58.decode(keypairJSON.privateKey));
const keypair = Keypair.fromSecretKey(privateKey);

const lpData = fs.readFileSync("lpKeypair.json", "utf8");
const lpKeypairJSON = JSON.parse(lpData);
const lpPrivateKey = new Uint8Array(bs58.decode(lpKeypairJSON.privateKey));
const lpKeypair = Keypair.fromSecretKey(lpPrivateKey);

const baseMint = "74kktMdTiUBV3zadZw9dBAKQkLUSsc6i4xAcTP1PPv3j";
const tokenSupply = 1_000_000;
const tokenDecimals = 8;
const solCap = 0.001;

export async function sendToken(
  fromKey: any,
  tokenAmount: number,
  mint: string,
  receiver: string
) {
  const fromWallet = fromKey;

  const mintAddress = new PublicKey(mint);

  const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mintAddress,
    fromWallet.publicKey
  );

  const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mintAddress,
    new PublicKey(new PublicKey(receiver))
  );

  const tx = new Transaction().add(
    splToken.createTransferInstruction(
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      tokenAmount * 10 ** tokenDecimals
    )
  );

  const sent = await connection.sendTransaction(tx, [fromWallet], {
    skipPreflight: false,
    maxRetries: 10,
  });

  let latestBlockhash = await connection.getLatestBlockhash("confirmed");
  try {
    const confirmation = await connection.confirmTransaction(
      {
        signature: sent,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      "confirmed"
    );
    if (confirmation.value.err) {
      throw new Error("🚨Transaction not confirmed.");
    }
    console.log(
      `Transaction Successfully Confirmed: https://solscan.io/tx/${sent}`
    );
    return true;
  } catch (error) {
    console.error("Transaction failed", error);
  }
  return false;
}

export async function buyToken(solAmount: number) {
  let tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: lpKeypair.publicKey,
      lamports: solAmount * 10 ** 9,
    })
  );

  const sent = await connection.sendTransaction(tx, [keypair], {
    skipPreflight: false,
    maxRetries: 10,
  });

  let latestBlockhash = await connection.getLatestBlockhash("confirmed");
  try {
    const confirmation = await connection.confirmTransaction(
      {
        signature: sent,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      "confirmed"
    );
    if (confirmation.value.err) {
      throw new Error("🚨Transaction not confirmed.");
    }
    console.log(
      `Transaction Successfully Confirmed: https://solscan.io/tx/${sent}`
    );
    console.log("Batching Tx in process!");

    let tokenMint = baseMint;
    let getEstimatedTokenReceiveAmount: any = await getEstimatedTokenReceive(
      solAmount,
      solCap
    );
    sendToken(
      lpKeypair,
      getEstimatedTokenReceiveAmount,
      tokenMint,
      keypair.publicKey.toString()
    );
  } catch (error) {
    console.error("Transaction failed", error);
  }
}

export async function sellToken(tokenAmount: number) {
  let tokenMint = baseMint;
  let sentToken = await sendToken(
    keypair,
    tokenAmount,
    tokenMint,
    lpKeypair.publicKey.toString()
  );
  if (sentToken) {
    console.log("Batching Tx in process!");

    let solLamportAmount =await getEstimatedSolReceive(tokenAmount, solCap) * 10 ** 9;
    let tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: lpKeypair.publicKey,
        toPubkey: keypair.publicKey,
        lamports: solLamportAmount,
      })
    );

    const sent = await connection.sendTransaction(tx, [lpKeypair], {
      skipPreflight: false,
      maxRetries: 10,
    });

    let latestBlockhash = await connection.getLatestBlockhash("confirmed");
    try {
      const confirmation = await connection.confirmTransaction(
        {
          signature: sent,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );
      if (confirmation.value.err) {
        throw new Error("🚨Transaction not confirmed.");
      }
      console.log(
        `Transaction Successfully Confirmed: https://solscan.io/tx/${sent}`
      );
      return true;
    } catch (error) {
      console.error("Transaction failed", error);
    }
    return false;
  }
}

// buyToken(0.0001);
sellToken(100_000);