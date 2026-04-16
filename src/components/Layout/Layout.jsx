import { Link, NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            Car Showroom
          </Link>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      {/* <footer className={styles.footer}>
        <div className={styles.footerInner}>
        </div>
      </footer> */}
    </div>
  )
}

