import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { MenuProvider } from "./context/MenuContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/msalConfig.ts";
import { PublicClientApplication } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <ThemeProvider>
                <MsalProvider instance={msalInstance}>
                    <AuthProvider>
                        <MenuProvider>
                            <NotificationProvider>
                                <AppWrapper>
                                        <App />
                                </AppWrapper>
                            </NotificationProvider>
                        </MenuProvider>
                    </AuthProvider>
                </MsalProvider>
            </ThemeProvider>
        </StrictMode>
    );
});