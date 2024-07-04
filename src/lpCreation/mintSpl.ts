import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import "dotenv/config";

const umi = createUmi(process.env.SOLANA_RPC!);

const data = fs.readFileSync("lpkeypair.json", "utf8");
const keypair = JSON.parse(data);
const privateKey = keypair.privateKey;

const userWallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(bs58.decode(privateKey))
);
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
  name: "Best Token Ever",
  symbol: "BTE",
  uri: "https://cf-ipfs.com/ipfs/QmX6jr8iQq91SX4m8GybgeXuPBHLyiqwajtRo62AeGvcyD",
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata());

createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 8,
  amount: 1000000_00000000,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
})
  .sendAndConfirm(umi)
  .then(() => {
    console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
  })
  .catch((err) => {
    console.error("Error minting tokens:", err);
  });
