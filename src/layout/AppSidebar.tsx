import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router';

import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  ListIcon,
  LockIcon,
  PageIcon,
  TableIcon,
  UserIcon,
  PieChartIcon as ChartIcon,
  HouseIcon,
  UserCogIcon,
  FolderIcon,
  FileTextIcon,
  FingerprintPatternIcon,
  LockOpenIcon,
} from '../icons';
import { useSidebar } from '../context/SidebarContext';
import type { MenuItem } from '../types/admin/menu-items/menu-item.types';
import { useMenu } from '../hooks/useMenu';
import { useAuth } from '../hooks/auth/useAuth';
import { ROUTES } from '../constants/routes.constants.ts';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; permission?: string }[];
  permission?: string;
};

function resolveIcon(iconName: string | null): React.ReactNode {
  switch (iconName?.toLowerCase()) {
    case 'home':
    case 'dashboard':
      return <GridIcon />;
    case 'users':
    case 'user':
      return <UserIcon />;
    case 'group':
    case 'groups':
    case 'roles':
      return <GroupIcon />;
    case 'chart':
    case 'charts':
    case 'analytics':
    case 'reports':
      return <ChartIcon />;
    case 'list':
    case 'menu':
      return <ListIcon />;
    case 'table':
    case 'tables':
      return <TableIcon />;
    case 'calendar':
      return <CalenderIcon />;
    case 'lock':
    case 'security':
    case 'permissions':
      return <LockIcon />;
    case 'settings':
    case 'page':
      return <PageIcon />;
    default:
      return <GridIcon />;
  }
}

// Flatten all active children into flat subItems (max 2 levels in sidebar)
function flattenChildren(children: MenuItem[]): { name: string; path: string }[] {
  const result: { name: string; path: string }[] = [];
  for (const child of children) {
    if (!child.active) continue;
    if (child.url) {
      result.push({ name: child.label, path: child.url });
    }
    if (child.children?.length) {
      result.push(...flattenChildren(child.children));
    }
  }
  return result;
}

// Transform API MenuItem[] → sidebar NavItem[]
function transformToNavItems(items: MenuItem[]): NavItem[] {
  return items
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const navItem: NavItem = {
        name: item.label,
        icon: resolveIcon(item.icon),
      };

      if (item.children?.length) {
        const subItems = flattenChildren(item.children);
        if (subItems.length > 0) {
          navItem.subItems = subItems;
        } else if (item.url) {
          navItem.path = item.url;
        }
      } else if (item.url) {
        navItem.path = item.url;
      }

      return navItem;
    });
}

// Principal section
const principalItems: NavItem[] = [
  { icon: <HouseIcon />, name: 'Inicio', path: ROUTES.HOME },
  { icon: <UserIcon />, name: 'Perfil', path: ROUTES.PROFILE },
];

// Correspondencia section
const CORRESPONDENCIA_ITEMS: NavItem[] = [
  {
    icon: <FolderIcon />,
    name: 'Tramites',
    subItems: [
      {
        name: 'Tramites',
        path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ALL,
        pro: false,
        permission: 'correspondencia_tramite.all',
      },
      {
        name: 'Bandeja de Entrada',
        path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.PENDING,
        pro: false,
        permission: 'correspondencia_tramite.pending',
      },
      {
        name: 'Bandeja de Salida',
        path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ATTENDED,
        pro: false,
        permission: 'correspondencia_tramite.attended',
      },
      {
        name: 'Archivados',
        path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ARCHIVED,
        pro: false,
        permission: 'correspondencia_tramite.archived',
      },
    ],
  },
  {
    icon: <FileTextIcon />,
    name: 'Documentos',
    path: ROUTES.CORRESPONDENCE.DOCUMENTS,
    permission: 'correspondencia_documentos.index',
  },
  {
    icon: <FingerprintPatternIcon />,
    name: 'Firma digital',
    path: ROUTES.CORRESPONDENCE.SIGN_DOCUMENT,
    permission: 'correspondencia_firmar.index',
  },
];

// Static admin section items (permission key → path)
const ALL_ADMIN_ITEMS: NavItem[] = [
  // { icon: <LockIcon />, name: "Permisos", path: "/admin/permisos", permission: "permissions.index" },
  // { icon: <UsersIcon />, name: "Roles", path: "/admin/roles", permission: "roles.index" },
  // { icon: <ListIcon />, name: "Ítems de Menú", path: "/admin/menu", permission: "menu_items.index" },
  {
    icon: <LockOpenIcon />,
    name: 'Accesos',
    subItems: [
      { name: 'Permisos', path: ROUTES.PERMISSIONS.LIST, pro: false, permission: 'permissions.index' },
      { name: 'Roles', path: ROUTES.ROLES.LIST, pro: false, permission: 'roles.index' },
      { name: 'Ítems de Menú', path: ROUTES.MENU_ITEMS.LIST, pro: false, permission: 'menu_items.index' },
    ],
  },
  { icon: <UserCogIcon />, name: 'Usuarios', path: ROUTES.USERS.LIST, permission: 'users.index' },
];

type MenuType = 'dynamic' | 'principal' | 'admin' | 'correspondencia';

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { menuItems } = useMenu();
  const { user } = useAuth();

  const adminItems: NavItem[] = ALL_ADMIN_ITEMS.map((item) => {
    if (item.subItems) {
      const filteredSubItems = item.subItems.filter(
        (subItem) => !user?.permissions?.length || user.permissions.includes(subItem.permission),
      );
      if (filteredSubItems.length === 0) {
        return null;
      }
      return {
        ...item,
        subItems: filteredSubItems,
      };
    }
    if (!item.permission || !user?.permissions?.length || user.permissions.includes(item.permission)) {
      return item;
    }
    return null;
  }).filter(Boolean) as NavItem[];

  const correspondenciaItems: NavItem[] = CORRESPONDENCIA_ITEMS.filter(
    (item) => !user?.permissions?.length || user.permissions.includes(item.permission),
  );

  const dynamicNavItems = useMemo(() => transformToNavItems(menuItems), [menuItems]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: MenuType;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    const sections: { type: MenuType; items: NavItem[] }[] = [
      { type: 'dynamic', items: dynamicNavItems },
      { type: 'principal', items: principalItems },
      { type: 'admin', items: adminItems },
      { type: 'correspondencia', items: correspondenciaItems },
    ];

    sections.forEach(({ type, items }) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, dynamicNavItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: MenuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: MenuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index ? 'text-brand-500 rotate-180' : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'}`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px',
              }}
            >
              <ul className="mt-2 ml-9 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.name}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={isMobileOpen ? 'py-2' : 'flex justify-center py-8'}>
        {!isMobileOpen && (
          <Link to={ROUTES.HOME}>
            <img
              src={isExpanded || isHovered ? '/images/logo_emi/logo_sidebar.png' : '/images/logo_emi/emi_icono.png'}
              alt="Logo EMI"
              width={isExpanded || isHovered ? 150 : 32}
              height={isExpanded || isHovered ? 40 : 32}
            />
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Dynamic menu from API */}
            {/*{dynamicNavItems.length > 0 && (*/}
            {/*  <div>*/}
            {/*    <h2*/}
            {/*      className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${*/}
            {/*        !isExpanded && !isHovered*/}
            {/*          ? "lg:justify-center"*/}
            {/*          : "justify-start"*/}
            {/*      }`}*/}
            {/*    >*/}
            {/*      {isExpanded || isHovered || isMobileOpen ? (*/}
            {/*        "Ítems de Menú"*/}
            {/*      ) : (*/}
            {/*        <HorizontaLDots className="size-6" />*/}
            {/*      )}*/}
            {/*    </h2>*/}
            {/*    {renderMenuItems(dynamicNavItems, "dynamic")}*/}
            {/*  </div>*/}
            {/*)}*/}

            {/* Principal section */}
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 'Principal' : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(principalItems, 'principal')}
            </div>

            {/* Static admin section */}
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 'Administración' : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(adminItems, 'admin')}
            </div>

            {/* Static correspondencia section */}
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 'Correspondencia' : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(correspondenciaItems, 'correspondencia')}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
