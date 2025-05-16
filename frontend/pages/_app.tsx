import type { AppProps } from 'next/app'
import { RippleUI } from '@rippleui/core'
import '@rippleui/themes/dist/main.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RippleUI>
      <Component {...pageProps} />
    </RippleUI>
  )
}