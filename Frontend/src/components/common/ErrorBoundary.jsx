import React from "react";

/**
 * Error Boundary - React xatolarini ushlaydi va ko'rsatadi
 * Production da xatolar brauzerda xira bo'lib tashlanadi
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 border border-red-400 rounded-lg text-red-700">
          <h2 className="font-bold text-lg mb-2">❌ Xato yuz berdi</h2>
          <p className="mb-2">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yana urinib ko'ring
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
