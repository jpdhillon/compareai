import { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  )
}

export default MyApp
