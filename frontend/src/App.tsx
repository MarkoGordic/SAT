import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AuthProvider from "./providers/AuthProvider";
import OtisakRouter from "./router/OtisakRouter";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <OtisakRouter />
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;