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
          <nav className={styles.nav} aria-label="Primary">
            <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
              Vehicles
            </NavLink>
          </nav>
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

