import { ReactElement } from "react"
import Head from "next/head"
import Layout from "../components/common/Layout"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useEffect, useState } from "react"
import useStore from "../backend/store"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { getTwitterProgram } from "../backend/2.web3Provider"
import { web3 } from "@project-serum/anchor"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Container, Stack } from "@mui/material"
import { unixSecToDate } from "../backend/utils"
import { PublicKey } from "@solana/web3.js"

export default function Home() {
  const network = useStore((state) => state.network)
  const wallet = useAnchorWallet()
  const setIsLoading = useStore((state) => state.setIsLoading)

  const [tweetContent, setTweetContent] = useState("")
  const [tweetTopic, setTweetTopic] = useState("")
  const [tweetList, setTweetList] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      if (!wallet) return
      console.log(wallet)
      if (tweetList.length) return

      setIsLoading(true)
      try {
        const tweeterPro = getTwitterProgram(network, wallet as any)
        const list1 = await tweeterPro.account.tweet.all()
        setTweetList(list1)
        console.log(list1)
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    })()
  }, [network, wallet])

  const sendTweet = async () => {
    if (!wallet) return alert("Connect wallet")

    setIsLoading(true)
    try {
      const tweetAcc = web3.Keypair.generate()
      const twitterPro = getTwitterProgram(network, wallet as any)
      await twitterPro.rpc.sendTweet(tweetTopic, tweetContent, {
        accounts: {
          tweet: tweetAcc.publicKey,
          user: (wallet as any).publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [tweetAcc],
      })
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }

  const deleteTweet = async (_key: PublicKey) => {
    setIsLoading(true)
    console.log("deleting", _key.toString())
    try {
      const twitterPro = getTwitterProgram(network, wallet as any)
      await twitterPro.rpc.deleteTweet({
        accounts: {
          tweet: _key,
          author: (wallet as any).publicKey,
        },
      })
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>Solana Twitter</title>
        <meta name="description" content="D-app on solana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ margin: "10px" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <WalletMultiButton />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack>
            <Box>
              <TextField
                value={tweetTopic}
                onChange={(e) => setTweetTopic(e.target.value)}
                placeholder="Tweet Title"
              />
              <TextField
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                placeholder="Tweet Content"
              />
            </Box>
            <Button variant="contained" onClick={sendTweet}>
              Tweet
            </Button>
          </Stack>
          <Typography variant="h5">Recent Tweets</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {tweetList.map((el, idx) => (
              <Box
                key={idx}
                sx={{
                  width: "300px",
                  padding: "5px",
                  margin: "10px",
                  wordBreak: "break-all",
                  borderRadius: "7px",
                  border: "1px solid blue",
                }}
              >
                <Typography variant="h6">Title: {el.account.topic}</Typography>
                <Typography>Content: {el.account.content}</Typography>
                <Typography>Author: {el.account.author.toString()}</Typography>
                <Typography>
                  Date: {unixSecToDate(el.account.timestamp.toNumber())}
                </Typography>
                <Typography>
                  Tweet-address: {el.publicKey.toString()}
                </Typography>
                {wallet?.publicKey.toString() ===
                  el.account.author.toString() && (
                  <Button onClick={() => deleteTweet(el.publicKey)}>
                    Delete
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
