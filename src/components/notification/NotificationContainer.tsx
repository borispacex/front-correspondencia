import { useMemo, useState } from 'react';

import { Dropdown } from '../ui/dropdown/Dropdown';

import { DropdownItem } from '../ui/dropdown/DropdownItem';

import { Link } from 'react-router';

import { BellIcon, CheckCircleIcon, AlertIcon, CloseIcon, InfoIcon } from '../../icons';

import { formatTimeAgo } from '../../utils/time.utils';
import { useNotifications } from '../../hooks/useNotification.tsx';
import { ROUTES } from '../../constants/routes.constants.ts';

const notificationStyles = {
  success: {
    dot: 'bg-success-500',
    iconBg: 'bg-success-100 dark:bg-success-500/15',
    iconColor: 'text-success-600 dark:text-success-400',
  },

  warning: {
    dot: 'bg-warning-500',
    iconBg: 'bg-warning-100 dark:bg-warning-500/15',
    iconColor: 'text-warning-600 dark:text-warning-400',
  },

  error: {
    dot: 'bg-error-500',
    iconBg: 'bg-error-100 dark:bg-error-500/15',
    iconColor: 'text-error-600 dark:text-error-400',
  },

  info: {
    dot: 'bg-primary-500',
    iconBg: 'bg-primary-100 dark:bg-primary-500/15',
    iconColor: 'text-primary-600 dark:text-primary-400',
  },
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const hasUnread = useMemo(() => notifications.some((notification) => !notification.read), [notifications]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const getNotificationIcon = (type: 'success' | 'warning' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="fill-current" width="18" height="18" />;

      case 'warning':
        return <AlertIcon className="fill-current" width="18" height="18" />;

      case 'error':
        return <CloseIcon className="fill-current" width="18" height="18" />;

      case 'info':
      default:
        return <InfoIcon className="fill-current" width="18" height="18" />;
    }
  };

  return (
    <div className="relative">
      <button
        className="dropdown-toggle relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {hasUnread && (
          <span className="absolute top-0.5 right-0 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
          </span>
        )}

        <BellIcon width="20" height="20" className={isOpen ? 'fill-current' : ''} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="shadow-theme-lg dark:bg-gray-dark absolute right-0 mt-[17px] flex h-[70vh] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 sm:h-[480px] sm:w-[361px] lg:right-0 dark:border-gray-800"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notificaciones</h5>

          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseIcon className="fill-current" width="24" height="24" />
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <button onClick={markAllAsRead} className="text-primary-500 text-xs hover:underline">
            Marcar todas como leídas
          </button>

          <button onClick={clearNotifications} className="text-error-500 text-xs hover:underline">
            Limpiar
          </button>
        </div>

        <ul className="custom-scrollbar flex-1 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="flex min-h-[200px] flex-1 items-center justify-center text-sm text-gray-500">
              No hay notificaciones
            </div>
          )}

          {notifications.map((notification) => {
            const styles = notificationStyles[notification.type];

            return (
              <li key={notification.id}>
                <DropdownItem
                  to={notification.link}
                  onItemClick={() => {
                    markAsRead(notification.id);

                    closeDropdown();
                  }}
                  className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <div className="relative">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
                      <span className={styles.iconColor}>{getNotificationIcon(notification.type)}</span>
                    </div>

                    {!notification.read && (
                      <span
                        className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900 ${styles.dot}`}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="mb-1">
                      <span className="font-medium text-gray-800 dark:text-white/90">{notification.title}</span>
                    </div>

                    <p className="text-theme-sm text-gray-500 dark:text-gray-400">{notification.message}</p>

                    <div className="text-theme-xs mt-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{notification.type}</span>

                      <span className="h-1 w-1 rounded-full bg-gray-400"></span>

                      <span>{formatTimeAgo(notification.createdAt)}</span>
                    </div>
                  </div>
                </DropdownItem>
              </li>
            );
          })}
        </ul>

        <Link
          to={ROUTES.HOME}
          className="mt-3 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Ver todas las notificaciones
        </Link>
      </Dropdown>
    </div>
  );
}
