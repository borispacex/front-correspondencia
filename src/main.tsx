import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { MenuProvider } from "./context/MenuContext.tsx";
import {NotificationProvider} from "./context/NotificationContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <MenuProvider>
                    <NotificationProvider>
                        <AppWrapper>
                            <App />
                        </AppWrapper>
                    </NotificationProvider>
                </MenuProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
);
