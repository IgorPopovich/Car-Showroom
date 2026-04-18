import { Link } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout({ children }) {
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
