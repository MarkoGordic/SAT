import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AuthProvider from "./providers/AuthProvider";
import OtisakRouter from "./router/OtisakRouter";
import SocketProvider from "./providers/SocketProvider";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <SocketProvider>
          <OtisakRouter />
        </SocketProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;