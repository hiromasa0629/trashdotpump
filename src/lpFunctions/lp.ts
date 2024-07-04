import {
  PublicKey,
  Connection,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { getEstimatedTokenReceive, getEstimatedSolReceive } from "./utils";
import * as splToken from "@solana/spl-token";

const baseMint = "74kktMdTiUBV3zadZw9dBAKQkLUSsc6i4xAcTP1PPv3j";
const tokenDecimals = 8;
const solCap = 10;

export async function sendToken(
  fromKey: any,
  tokenAmount: number,
  mint: string,
  receiver: string,
  connection: Connection
) {
  const fromWallet = fromKey;

  const mintAddress = new PublicKey(mint);

  // const splToken = require("@solana/spl-token");
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

  console.log("Receiving BTE tokenamount", tokenAmount);
  console.log("Receiving BTE", tokenAmount * 10 ** tokenDecimals);
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
    return sent;
  } catch (error) {
    console.error("Transaction failed", error);
  }
  return false;
}

export async function buyToken(
  solAmount: number,
  connection: Connection,
  keypairJSON: { publicKey: string; privateKey: string },
  lpKeypairJSON: { publicKey: string; privateKey: string }
) {
  const privateKey = new Uint8Array(bs58.decode(keypairJSON.privateKey));
  const keypair = Keypair.fromSecretKey(privateKey);
  const lpPrivateKey = new Uint8Array(bs58.decode(lpKeypairJSON.privateKey));
  const lpKeypair = Keypair.fromSecretKey(lpPrivateKey);

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
    let getEstimatedTokenReceiveAmount: any = getEstimatedTokenReceive(
      solAmount,
      solCap
    );
    return await sendToken(
      lpKeypair,
      getEstimatedTokenReceiveAmount,
      tokenMint,
      keypair.publicKey.toString(),
      connection
    );
  } catch (error) {
    console.error("Transaction failed", error);
  }
}

export async function sellToken(
  tokenAmount: number,
  connection: Connection,
  keypairJSON: { publicKey: string; privateKey: string },
  lpKeypairJSON: { publicKey: string; privateKey: string }
) {
  const privateKey = new Uint8Array(bs58.decode(keypairJSON.privateKey));
  const keypair = Keypair.fromSecretKey(privateKey);
  const lpPrivateKey = new Uint8Array(bs58.decode(lpKeypairJSON.privateKey));
  const lpKeypair = Keypair.fromSecretKey(lpPrivateKey);

  let tokenMint = baseMint;
  let sentToken = await sendToken(
    keypair,
    tokenAmount,
    tokenMint,
    lpKeypair.publicKey.toString(),
    connection
  );
  if (sentToken) {
    console.log("Batching Tx in process!");

    let solLamportAmount =
      (await getEstimatedSolReceive(tokenAmount, solCap)) * 10 ** 9;
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
      return sent;
    } catch (error) {
      console.error("Transaction failed", error);
    }
    return false;
  }
}

// buyToken(0.0001);
// sellToken(100_000);
