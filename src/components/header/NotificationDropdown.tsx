import { useMemo, useState } from "react";

import { Dropdown } from "../ui/dropdown/Dropdown";

import { DropdownItem } from "../ui/dropdown/DropdownItem";

import { Link } from "react-router";

import {
  BellIcon,
  CheckCircleIcon,
  AlertIcon,
  CloseIcon,
  InfoIcon, TrashBinIcon,
} from "../../icons";



import { formatTimeAgo } from "../../utils/time.utils";
import {useNotifications} from "../../hooks/useNotification.tsx";
import {ROUTES} from "../../constants/routes.constants.ts";

const notificationStyles = {
  success: {
    dot: "bg-success-500",
    iconBg:
        "bg-success-100 dark:bg-success-500/15",
    iconColor:
        "text-success-600 dark:text-success-400",
  },

  warning: {
    dot: "bg-warning-500",
    iconBg:
        "bg-warning-100 dark:bg-warning-500/15",
    iconColor:
        "text-warning-600 dark:text-warning-400",
  },

  error: {
    dot: "bg-error-500",
    iconBg:
        "bg-error-100 dark:bg-error-500/15",
    iconColor:
        "text-error-600 dark:text-error-400",
  },

  info: {
    dot: "bg-primary-500",
    iconBg:
        "bg-primary-100 dark:bg-primary-500/15",
    iconColor:
        "text-primary-600 dark:text-primary-400",
  },
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const hasUnread = useMemo(
      () =>
          notifications.some(
              (notification) => !notification.read
          ),
      [notifications]
  );

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const getNotificationIcon = (
      type:
          | "success"
          | "warning"
          | "error"
          | "info"
  ) => {
    switch (type) {
      case "success":
        return (
            <CheckCircleIcon
                className="fill-current"
                width="18"
                height="18"
            />
        );

      case "warning":
        return (
            <AlertIcon
                className="fill-current"
                width="18"
                height="18"
            />
        );

      case "error":
        return (
            <CloseIcon
                className="fill-current"
                width="18"
                height="18"
            />
        );

      case "info":
      default:
        return (
            <InfoIcon
                className="fill-current"
                width="18"
                height="18"
            />
        );
    }
  };

  return (
      <div className="relative">
        <button
            className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={toggleDropdown}
        >
          {hasUnread && (
              <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
                        <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
                    </span>
          )}

          <BellIcon
              width="20"
              height="20"
              className={
                isOpen ? "fill-current" : ""
              }
          />
        </button>

        <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="
absolute right-0 mt-2 z-[9999]

w-[calc(100vw-16px)] sm:w-[360px]
max-w-[380px]

h-[50vh] sm:h-[480px]

flex flex-col

rounded-2xl border border-gray-200
bg-white p-3 shadow-theme-lg
dark:border-gray-800 dark:bg-gray-dark
"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notificaciones
            </h5>

            <button
                onClick={toggleDropdown}
                className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <CloseIcon
                  className="fill-current"
                  width="24"
                  height="24"
              />
            </button>
          </div>

          <div className="mb-3 flex items-center justify-between gap-2">
            <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-gray-600 hover:text-brand-500 hover:underline dark:text-gray-400 dark:hover:text-brand-400"
            >
              Marcar todas como leídas
            </button>


            <button
                onClick={clearNotifications}
                className="text-xs font-medium text-gray-600 hover:text-error-500 hover:underline dark:text-gray-400 dark:hover:text-error-400"
            >
              <TrashBinIcon />
            </button>
          </div>

          <ul className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 && (
                <div className="flex flex-1 items-center justify-center min-h-[200px] text-sm text-gray-500">
                  No hay notificaciones
                </div>
            )}

            {notifications.map((notification) => {
              const styles =
                  notificationStyles[
                      notification.type
                      ];

              return (
                  <li key={notification.id}>
                    <DropdownItem
                        to={notification.link}
                        onItemClick={() => {
                          markAsRead(
                              notification.id
                          );

                          closeDropdown();
                        }}
                        className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                    >
                      <div className="relative">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}
                        >
                                            <span
                                                className={
                                                  styles.iconColor
                                                }
                                            >
                                                {getNotificationIcon(
                                                    notification.type
                                                )}
                                            </span>
                        </div>

                        {!notification.read && (
                            <span
                                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900 ${styles.dot}`}
                            />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="mb-1">
                                            <span className="font-medium text-gray-800 dark:text-white/90">
                                                {
                                                  notification.title
                                                }
                                            </span>
                        </div>

                        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                          {
                            notification.message
                          }
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                                            <span className="capitalize">
                                                {
                                                  notification.type
                                                }
                                            </span>

                          <span className="h-1 w-1 rounded-full bg-gray-400"></span>

                          <span>
                                                {formatTimeAgo(
                                                    notification.createdAt
                                                )}
                                            </span>
                        </div>
                      </div>
                    </DropdownItem>
                  </li>
              );
            })}
          </ul>

          <Link
              to={ROUTES.HOME}
              className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            Ver todas las notificaciones
          </Link>
        </Dropdown>
      </div>
  );
}