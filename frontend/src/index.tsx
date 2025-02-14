import "./i18n";
import "./index.css";
import App from "./App";
import ReactDOM from "react-dom/client";
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import { ThemeProvider } from "@gravity-ui/uikit";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ThemeProvider theme="light">
    <App />
  </ThemeProvider>
);
