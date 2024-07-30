import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://cdn.eds.equinor.com/font/equinor-font.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.eds.equinor.com/font/equinor-mono.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
