import { ReactNode } from 'react'
import Footer from "./components/footer"
import Navbar from "./components/navbar"
import "../assets/styles/global.sass";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AuthProvider } from './components/auth';
import type { Metadata } from 'next';
import NotificationCenter from './components/notification-center';
import UppyProvider from './uppy';
// import NextTopLoader from 'nextjs-toploader';
// import Ipfs from './components/ipfs'; // slows down the page too much



export const metadata: Metadata = {
  title: 'Futureporn.net',
  description: "The Galaxy's Best VTuber Hentai Site",
  other: {
    RATING: 'RTA-5042-1996-1400-1577-RTA'
  },
  metadataBase: new URL('https://futureporn.net'),
  twitter: {
    site: '@futureporn_net',
    creator: '@cj_clippy'
  },
  alternates: {
    types: {
      'application/atom+xml': '/feed/feed.xml',
      'application/rss+xml': '/feed/rss.xml',
      'application/json': '/feed/feed.json'
    }
  }
}

type Props = {
  children: ReactNode;
}


export default function RootLayout({
  children,
}: Props) {
  return (
    <html lang="en">
      <body>
      {/* <NextTopLoader
        color="#ac0722"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
      /> */}
        <AuthProvider>
          <UppyProvider>
            <Navbar />
            <NotificationCenter />
            <div className="container">
              {children}
              <Footer />
            </div>
          </UppyProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
