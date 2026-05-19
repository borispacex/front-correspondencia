import {
    createContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export type NotificationType =
    | "success"
    | "warning"
    | "error"
    | "info";

export interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];

    addNotification: (
        notification: Omit<
            Notification,
            "id" | "createdAt" | "read"
        >
    ) => void;

    markAsRead: (id: number) => void;

    markAllAsRead: () => void;

    removeNotification: (id: number) => void;

    clearNotifications: () => void;
}

export const NotificationContext =
    createContext<NotificationContextType | null>(null);

const STORAGE_KEY = "app_notifications";

interface Props {
    children: React.ReactNode;
}

export function NotificationProvider({
                                         children,
                                     }: Props) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    /**
     * Load notifications from localStorage
     */
    useEffect(() => {
        const storedNotifications =
            localStorage.getItem(STORAGE_KEY);

        if (storedNotifications) {
            try {
                setNotifications(
                    JSON.parse(storedNotifications)
                );
            } catch (error) {
                console.error(
                    "Error parsing notifications:",
                    error
                );
            }
        }
    }, []);

    /**
     * Persist notifications
     */
    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(notifications)
        );
    }, [notifications]);

    /**
     * Add notification
     */
    function addNotification(
        notification: Omit<
            Notification,
            "id" | "createdAt" | "read"
        >
    ) {
        const newNotification: Notification = {
            ...notification,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            read: false,
        };

        setNotifications((prev) => [
            newNotification,
            ...prev,
        ]);
    }

    /**
     * Mark one as read
     */
    function markAsRead(id: number) {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? {
                        ...notification,
                        read: true,
                    }
                    : notification
            )
        );
    }

    /**
     * Mark all as read
     */
    function markAllAsRead() {
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    }

    /**
     * Remove one notification
     */
    function removeNotification(id: number) {
        setNotifications((prev) =>
            prev.filter(
                (notification) =>
                    notification.id !== id
            )
        );
    }

    /**
     * Remove all notifications
     */
    function clearNotifications() {
        setNotifications([]);
    }

    const value = useMemo(
        () => ({
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            clearNotifications,
        }),
        [notifications]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}