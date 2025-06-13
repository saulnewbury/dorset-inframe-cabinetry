import { Inter } from 'next/font/google'
import './global.css'
import ModelContextProvider from '../components/ModelContextProvider'
import SessionContextProvider from '@/components/SessionContextProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-light`}>
        <SessionContextProvider>
          <ModelContextProvider>{children}</ModelContextProvider>
        </SessionContextProvider>
      </body>
    </html>
  )
}
