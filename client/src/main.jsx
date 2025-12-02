import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import App from "./App.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";
import "./index.css";
// import { persistor, store } from "./redux/root.store.js";
import store from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
      {/* </PersistGate> */}
    </Provider>
  </StrictMode>
);
