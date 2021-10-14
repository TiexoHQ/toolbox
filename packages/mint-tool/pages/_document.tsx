import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { cache } from '@emotion/css'
import createEmotionServer from '@emotion/server/create-instance'

const emotionServer = createEmotionServer(cache)

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        const { ids, css } = emotionServer.extractCritical(initialProps.html)
        const styles = [
            <style key={cache.key} data-emotion={`${cache.key} ${ids.join(' ')}`}>
                {css}
            </style>,
        ]
        return { ...initialProps, styles }
    }

    render() {
        return (
            <Html>
                <Head></Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
