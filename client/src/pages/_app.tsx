import clsx from "clsx"
import { NextPage } from "next"
import type { AppProps } from "next/app"
import Head from "next/head"
import { SessionProvider } from "next-auth/react"

import { monteserratVariables } from "@/assets/font"
import Wrapper from "@/pages/_wrapper"

import "@/styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import "react-chat-elements/dist/main.css"
import { ErrorBoundary } from "react-error-boundary"

const App: NextPage<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <Head>
        <title>Artlinkup</title>
      </Head>
      <ErrorBoundary fallback={<div >Error Encountered </div>}>
        <SessionProvider session={session}>
          <Wrapper pageProps={pageProps} className={clsx(monteserratVariables)}>
            <Component {...pageProps} />
          </Wrapper>
        </SessionProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
