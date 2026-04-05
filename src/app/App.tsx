import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

type ErrorBoundaryState = {
  hasError: boolean;
  message?: string;
};

class AppErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Runtime render error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#072c3c]">Something went wrong while loading the site.</h1>
            <p className="mt-3 text-sm text-[#475569]">
              Please refresh. If this continues, check browser console logs for the runtime error.
            </p>
            {this.state.message ? (
              <p className="mt-2 text-xs text-[#64748b]">{this.state.message}</p>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}
