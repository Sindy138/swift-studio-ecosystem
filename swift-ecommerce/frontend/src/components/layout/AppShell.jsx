import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import styles from './AppShell.module.css'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.shell}>
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.main}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.content} id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
