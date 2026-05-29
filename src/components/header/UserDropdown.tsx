import { useState } from 'react';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/auth/useAuth';
import { ChevronDownIcon, LogOutIcon, UserIcon } from '../../icons';
import { ROUTES } from '../../constants/routes.constants.ts';

const API_URL = import.meta.env.VITE_API_URL;

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400">
        <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
          <img src={user?.foto ? `${API_URL}/storage/${user.foto}` : '/images/user_emi/usuario.jpg'} alt="User" />
        </span>

        <span className="text-theme-sm mr-1 hidden font-medium sm:block">{`${user?.name ?? ''} ${user?.last_name ?? ''}`}</span>
        <ChevronDownIcon
          width="20"
          height="20"
          className={`stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="shadow-theme-lg dark:bg-gray-dark absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800"
      >
        <div>
          <span className="text-theme-sm block font-medium text-gray-700 dark:text-gray-400">
            {`${user?.name ?? ''} ${user?.last_name ?? ''}`}
          </span>
          <span className="text-theme-xs mt-0.5 block text-gray-500 dark:text-gray-400">{user?.email ?? '—'}</span>
        </div>

        <ul className="flex flex-col gap-1 border-b border-gray-200 pt-4 pb-3 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to={ROUTES.PROFILE}
              className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserIcon
                width="24"
                height="24"
                strokeWidth={2}
                className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
              />
              Editar perfil
            </DropdownItem>
          </li>
        </ul>
        <Link
          to="/iniciar-sesion"
          className="group text-theme-sm mt-3 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <LogOutIcon
            width="24"
            height="24"
            strokeWidth={2}
            className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
          />
          Cerrar sesión
        </Link>
      </Dropdown>
    </div>
  );
}
