import { Idl, Program, Provider, Wallet } from "@project-serum/anchor"
import { Connection } from "@solana/web3.js"
import { defaultNetwork, serverInfo } from "./1.serverInfo"
import TwitterIdl from "./twitter.json"

export const getServerInfo = (network: string) => {
  if (serverInfo[network]) return serverInfo[network]
  return serverInfo[defaultNetwork]
}

const getProvider = (network: string, wallet: Wallet) => {
  const networkUrl = getServerInfo(network).networkUrl
  const connection = new Connection(networkUrl)
  return new Provider(connection, wallet, {})
}

export const getTwitterProgram = (network: string, wallet: Wallet) => {
  const twitterAddr = getServerInfo(network).contracts.twitter
  return new Program(
    TwitterIdl as Idl,
    twitterAddr,
    getProvider(network, wallet)
  )
}
