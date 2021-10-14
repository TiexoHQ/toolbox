import '../styles/global'
import { CacheProvider } from '@emotion/react'
import { cache } from '@emotion/css'
import Head from 'next/head'

import { ThemeProvider } from '@mui/material'
import { theme } from '../styles/themes/dark'

import Header from '../components/header'

function MyApp({ Component, pageProps }: any) {
    return (
        <CacheProvider value={cache}>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <Header></Header>
                <Component {...pageProps} />
            </ThemeProvider>
        </CacheProvider>
    )
}
export default MyApp
