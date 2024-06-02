import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SocketProvider } from '@/context/Socket'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  )
}
