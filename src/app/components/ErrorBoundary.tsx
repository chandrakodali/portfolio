import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component for graceful error handling
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // In production, you could send this to an error tracking service
        // Example: errorTrackingService.log({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-gray-400 mb-6">
                            We're sorry, an unexpected error occurred. Please refresh the page to try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        >
                            Refresh Page
                        </button>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                                <summary className="text-red-400 cursor-pointer text-sm font-medium">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 text-xs text-red-300 overflow-auto max-h-40">
                                    {this.state.error.message}
                                    {'\n\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Section-level error boundary with a more subtle fallback
 */
export class SectionErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('SectionErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center text-gray-500">
                    <p>This section couldn't be loaded.</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
