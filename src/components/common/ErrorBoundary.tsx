// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { useTranslation } from '../../i18n'

interface Props {
  children: ReactNode
  t: (key: string, fallback?: string) => string
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  render() {
    const { t } = this.props

    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>{t('errorBoundary.title')}</h2>
          <p>{t('errorBoundary.message')}</p>
          <button onClick={() => window.location.reload()}>
            {t('errorBoundary.reload')}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper that reads `t` from the local I18n context and passes it to the class component
const ErrorBoundaryWithT: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  return <ErrorBoundary t={t}>{children}</ErrorBoundary>
}

export default ErrorBoundaryWithT
