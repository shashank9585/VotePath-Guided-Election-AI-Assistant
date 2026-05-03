import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, info) {
    // Log in dev only — stripped by esbuild in production
    console.error('[VoteFlow ErrorBoundary]', error, info);
  }

  handleReset() {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl font-black text-gray-800 mb-3">Something went wrong</h1>
            <p className="text-gray-500 mb-2">
              An unexpected error occurred in VoteFlow AI.
            </p>
            <p className="text-xs text-gray-400 bg-gray-100 px-4 py-2 rounded-lg font-mono mb-8">
              {this.state.errorMessage}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => this.handleReset()}
                className="btn-primary"
              >
                🏠 Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                🔄 Reload Page
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-8">
              Need help? Visit{' '}
              <a href="https://eci.gov.in" className="text-blue-600 hover:underline">eci.gov.in</a>
              {' '}for official election information.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
