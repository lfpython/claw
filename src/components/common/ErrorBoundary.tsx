import React from 'react'

interface Props { children: React.ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/50 p-8">
          <p className="text-lg font-medium text-white mb-2">出错了</p>
          <p className="text-sm">{this.state.error?.message}</p>
          <button className="mt-4 text-blue-400 text-sm" onClick={() => this.setState({ hasError: false })}>
            重试
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
