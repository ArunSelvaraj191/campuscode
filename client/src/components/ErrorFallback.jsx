import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" style={{ padding: "1rem", textAlign: "center" }}>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary} style={{ marginTop: "1rem" }}>
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;
