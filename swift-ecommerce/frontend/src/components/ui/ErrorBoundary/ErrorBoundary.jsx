import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap} role="alert">
          <div className={styles.icon} aria-hidden>⚠</div>
          <h2 className={styles.title}>Algo salió mal</h2>
          <p className={styles.text}>Se produjo un error inesperado. Recarga la página o vuelve al inicio.</p>
          <div className={styles.actions}>
            <button className={styles.btnPrimary} onClick={() => window.location.reload()}>
              Recargar página
            </button>
            <button className={styles.btnGhost} onClick={this.handleReset}>
              Intentar de nuevo
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
