import { Link, useNavigate } from 'react-router';
import { ROUTES } from '../../constants/routes.constants.ts';
import { ArrowLeftIcon, ChevronRightIcon } from '../../icons';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  items?: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, items }) => {
  const navigate = useNavigate();

  const showBackButton = !!items?.length;

  const breadcrumbs = items ?? [{ label: pageTitle }];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group hover:text-brand-500 dark:hover:text-brand-400 inline-flex w-fit items-center gap-1 text-sm font-medium text-gray-500 transition-colors dark:text-gray-400"
          >
            <ArrowLeftIcon className="size-4" />
          </button>
        )}

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">{pageTitle}</h2>
      </div>

      <nav>
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              to={ROUTES.HOME}
              className="hover:text-brand-500 dark:hover:text-brand-400 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors dark:text-gray-400"
            >
              Inicio
            </Link>
          </li>

          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRightIcon className="stroke-current text-gray-400 dark:text-gray-500" width="17" height="16" />

              {item.path ? (
                <Link
                  to={item.path}
                  className="hover:text-brand-500 dark:hover:text-brand-400 text-sm text-gray-500 transition-colors dark:text-gray-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm text-gray-800 dark:text-white/90">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
