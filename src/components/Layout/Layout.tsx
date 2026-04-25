import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.layout__header}>
        <div className={styles['layout__header-inner']}>
          <Link to="/" className={styles.layout__logo}>
            Car Showroom
          </Link>
        </div>
      </header>
      <main className={styles.layout__main}>{children}</main>
      {/* <footer className={styles.layout__footer}>
        <div className={styles['layout__footer-inner']}>
        </div>
      </footer> */}
    </div>
  )
}
