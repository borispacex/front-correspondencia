import { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { AdminDashboardData } from '../../../types/dashboard/dashboard.type.ts';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard.ts';

// ─── Colores fijos para roles (se asignan por índice) ───────────────────────
const ROLE_COLORS = ['#465fff', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// ─── Loading skeleton ────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    </div>
  );
}

// ─── Error ────────────────────────────────────────────────────────────────────

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10">
      <div className="text-center">
        <p className="text-3xl">⚠️</p>
        <p className="mt-2 font-semibold text-red-700 dark:text-red-400">Error al cargar datos</p>
        <p className="mt-1 text-sm text-red-500">{message}</p>
        <button onClick={onRetry} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
          Reintentar
        </button>
      </div>
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  sub,
  color = '#465fff',
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: color + '18' }}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mt-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</h4>
        {sub && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

// ─── RolesChart ───────────────────────────────────────────────────────────────

function RolesChart({ data }: { data: AdminDashboardData['roles'] }) {
  const colors = data.map((_, i) => ROLE_COLORS[i % ROLE_COLORS.length]);
  const options: ApexOptions = {
    chart: { type: 'donut', fontFamily: 'Outfit, sans-serif' },
    labels: data.map((r) => r.name),
    colors,
    legend: { position: 'bottom', fontFamily: 'Outfit', fontSize: '13px' },
    dataLabels: { enabled: true, style: { fontSize: '12px' } },
    plotOptions: { pie: { donut: { size: '60%' } } },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v: number) => `${v} usuarios` } },
  };
  return <Chart options={options} series={data.map((r) => r.users)} type="donut" height={260} />;
}

// ─── UsersByUnitChart ─────────────────────────────────────────────────────────

function UsersByUnitChart({ data }: { data: AdminDashboardData['users_by_unit'] }) {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#465fff'],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, borderRadiusApplication: 'end', barHeight: '60%' } },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    xaxis: { categories: data.map((u) => u.unit), labels: { style: { fontSize: '12px' } } },
    grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    tooltip: { y: { formatter: (v: number) => `${v} usuarios` } },
  };
  return (
    <Chart options={options} series={[{ name: 'Usuarios', data: data.map((u) => u.count) }]} type="bar" height={260} />
  );
}

// ─── UsersMonthlyChart ────────────────────────────────────────────────────────

function UsersMonthlyChart({ data }: { data: number[] }) {
  const options: ApexOptions = {
    chart: { type: 'area', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#465fff'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.02 } },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: MONTHS,
      labels: { style: { fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: '11px' } } },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (v: number) => `${v} nuevos` } },
  };
  return <Chart options={options} series={[{ name: 'Nuevos usuarios', data }]} type="area" height={200} />;
}

// ─── ChargesChart ─────────────────────────────────────────────────────────────

function ChargesChart({ data }: { data: AdminDashboardData['charges_by_dept'] }) {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#10b981'],
    plotOptions: { bar: { borderRadius: 4, borderRadiusApplication: 'end', columnWidth: '55%' } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((d) => d.dept),
      labels: { style: { fontSize: '11px' }, rotate: -35 },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (v: number) => `${v} cargos` } },
  };
  return (
    <Chart options={options} series={[{ name: 'Cargos', data: data.map((d) => d.charges) }]} type="bar" height={200} />
  );
}

// ─── PermissionsTable ─────────────────────────────────────────────────────────

function PermissionsTable({ data }: { data: AdminDashboardData['permissions'] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Permiso</th>
            <th className="pb-3 text-center font-medium text-gray-500 dark:text-gray-400">Otorgado</th>
            <th className="pb-3 text-center font-medium text-gray-500 dark:text-gray-400">Denegado</th>
            <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Cobertura</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => {
            const total = p.granted + p.denied;
            const pct = total > 0 ? Math.round((p.granted / total) * 100) : 0;
            return (
              <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                <td className="py-3 font-medium text-gray-700 dark:text-white/80">{p.name}</td>
                <td className="py-3 text-center">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    {p.granted}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400">
                    {p.denied}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{pct}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── MenuList ─────────────────────────────────────────────────────────────────

function MenuList({ data }: { data: AdminDashboardData['menu_items'] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {data.map((m, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${m.active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-white/80">{m.name}</span>
          </div>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {m.roles} roles
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export const AdminDashboard = () => {
  const { data, loading, error, refetch } = useAdminDashboard();
  const [tab, setTab] = useState<'overview' | 'permisos' | 'menu'>('overview');

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorCard message={error ?? 'Sin datos'} onRetry={refetch} />;

  const { metrics, roles, users_by_unit, users_monthly, charges_by_dept, permissions, menu_items } = data;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Dashboard Administración</h2>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
            Usuarios, roles, cargos y permisos del sistema
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          {(['overview', 'permisos', 'menu'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                tab === t
                  ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard
          icon="👤"
          label="Usuarios totales"
          value={metrics.total_users}
          sub={`${metrics.active_users} activos`}
          color="#465fff"
        />
        <MetricCard
          icon="🔐"
          label="Roles definidos"
          value={metrics.total_roles}
          sub="Niveles de acceso"
          color="#0ea5e9"
        />
        <MetricCard
          icon="🏢"
          label="Departamentos"
          value={metrics.total_departments}
          sub="En todas las unidades"
          color="#10b981"
        />
        <MetricCard
          icon="💼"
          label="Cargos registrados"
          value={metrics.total_charges}
          sub="Puestos del sistema"
          color="#f59e0b"
        />
      </div>

      {/* ── Tab: Overview ── */}
      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Distribución por rol</h3>
              <RolesChart data={roles} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Usuarios por unidad académica
              </h3>
              <UsersByUnitChart data={users_by_unit} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">
                Nuevos usuarios por mes ({new Date().getFullYear()})
              </h3>
              <p className="mb-4 text-xs text-gray-400">Crecimiento acumulado del sistema</p>
              <UsersMonthlyChart data={users_monthly} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">Cargos por departamento</h3>
              <p className="mb-4 text-xs text-gray-400">Top 10 departamentos con más cargos</p>
              <ChargesChart data={charges_by_dept} />
            </div>
          </div>
        </>
      )}

      {/* ── Tab: Permisos ── */}
      {tab === 'permisos' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
            Cobertura de permisos por tipo
          </h3>
          <PermissionsTable data={permissions} />
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            * Total de permisos registrados: <strong>{metrics.total_permissions}</strong>
          </p>
        </div>
      )}

      {/* ── Tab: Menú ── */}
      {tab === 'menu' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
            Ítems de menú y acceso por rol
          </h3>
          <MenuList data={menu_items} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
