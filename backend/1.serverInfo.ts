interface ServerInfoInt {
  readonly [net: string]: {
    networkUrl: string
    contracts: {
      twitter: string
    }
  }
}

export const serverInfo: ServerInfoInt = {
  localnet: {
    networkUrl: "http://127.0.0.1:8899",
    contracts: {
      twitter: "HC4NZEsuGoVvbxBypDFjuFLRakQussGc5mfh9cGNHDgY",
    },
  },
  devnet: {
    networkUrl: "https://api.devnet.solana.com",
    contracts: {
      twitter: "HC4NZEsuGoVvbxBypDFjuFLRakQussGc5mfh9cGNHDgY",
    },
  },
}
export const defaultNetwork = "devnet"
