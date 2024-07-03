import fs from 'fs';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const keypair = Keypair.generate();
const publicKey = keypair.publicKey.toBase58();
const privateKey = bs58.encode(keypair.secretKey);

const keypairJSON = {
  publicKey: publicKey,
  privateKey: privateKey
};

const jsonString = JSON.stringify(keypairJSON, null, 2);

fs.writeFile('keypair.json', jsonString, (err: NodeJS.ErrnoException | null) => {
  if (err) throw err;
  console.log('Keypair saved to keypair.json');
});
