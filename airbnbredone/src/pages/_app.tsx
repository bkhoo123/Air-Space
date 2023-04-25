import '<prefix>/styles/globals.css'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import NavBar from '<prefix>/components/navbar'
import UserProvider from '<prefix>/context/UserContext'


const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <UserProvider>
      <NavBar/>
      <hr />
      <Component {...pageProps} />
      </UserProvider>
    </main>
  )
}