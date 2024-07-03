import { PublicKey, Connection } from "@solana/web3.js";
import "dotenv/config";

const connection = new Connection(
  "https://newest-dawn-borough.solana-mainnet.quiknode.pro/70aa5ca62456de58a913bd6510229c9756adbca2/"
);

export async function getSolBal(walletAddress: string) {
  const solBal = await connection.getBalance(
    new PublicKey("9wUXkLWDcUAmjfVe2Z2EMeBisAj5UWzxHhDNjEhqbvgw")
  );
  return solBal;
}

export async function getTokenBal(walletAddress: string) {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(walletAddress),
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      }
    );

    const nonEmptyTokenAccounts = tokenAccounts.value.filter((account) => {
      const tokenAmount = account.account.data.parsed.info.tokenAmount;
      return tokenAmount.uiAmount > 0;
    });

    let tokenAmount =
      nonEmptyTokenAccounts[0].account.data.parsed.info.tokenAmount.uiAmount;
    let tokenDecimal =
      nonEmptyTokenAccounts[0].account.data.parsed.info.tokenAmount.decimals;
    tokenAmount = tokenAmount * 10 ** tokenDecimal;

    return tokenAmount;
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    return {};
  }
}

export async function getEstimatedTokenReceive(
  solInput: number,
  totalRaisingAmount: number
) {
  let tokenRatio = solInput / totalRaisingAmount;
  let expectedReceiveAmount = 1000000 * tokenRatio;

  return expectedReceiveAmount;
}

export async function getEstimatedSolReceive(
  tokenInput: number,
  totalRaisingAmount: number
) {
  let solRatio = tokenInput / 1000000;
  let expectedReceiveAmount = totalRaisingAmount * solRatio;

  return expectedReceiveAmount;
}
