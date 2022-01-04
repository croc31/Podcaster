import '../styles/globals.scss'
import styles from '../styles/app.module.scss'
import type { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { Player } from '../components/Player'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player></Player>
    </div>
  );

}

export default MyApp
