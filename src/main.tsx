import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./Redux/Store.ts";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <ToastContainer theme="dark" />
      <App />
    </BrowserRouter>
  </Provider>
);
