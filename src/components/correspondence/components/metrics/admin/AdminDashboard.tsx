import { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// ─── DATA ───────────────────────────────────────────────────────────────────

const ROLES = [
  { name: 'Administrador', users: 4, color: '#465fff' },
  { name: 'Director', users: 8, color: '#0ea5e9' },
  { name: 'Funcionario', users: 87, color: '#10b981' },
  { name: 'Portapliego', users: 12, color: '#f59e0b' },
  { name: 'Externo', users: 3, color: '#6b7280' },
];

const USERS_BY_UNIT = [
  { unit: 'Rectorado', count: 18 },
  { unit: 'UALP', count: 42 },
  { unit: 'UASC', count: 38 },
  { unit: 'UACBBA', count: 35 },
  { unit: 'UAT', count: 22 },
  { unit: 'UAR', count: 15 },
  { unit: 'Nacional', count: 24 },
];

const USERS_MONTHLY = [8, 12, 7, 15, 22, 18, 9, 14, 20, 17, 11, 16];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CHARGES_BY_DEPT = [
  { dept: 'Operaciones', charges: 32 },
  { dept: 'UEBU', charges: 28 },
  { dept: 'Planificación', charges: 19 },
  { dept: 'Informática', charges: 24 },
  { dept: 'RRHH', charges: 21 },
  { dept: 'Infraestructura', charges: 17 },
  { dept: 'Contrataciones', charges: 14 },
  { dept: 'Tesorería', charges: 18 },
];

const PERMISSIONS = [
  { name: 'Ver documentos', granted: 190, denied: 8 },
  { name: 'Crear doc.', granted: 142, denied: 56 },
  { name: 'Firmar / Derivar', granted: 95, denied: 103 },
  { name: 'Admin usuarios', granted: 12, denied: 186 },
  { name: 'Config. sistema', granted: 4, denied: 194 },
];

const MENU_ITEMS = [
  { name: 'Correspondencia', roles: 5, active: true },
  { name: 'Documentos', roles: 5, active: true },
  { name: 'Usuarios', roles: 2, active: true },
  { name: 'Roles / Permisos', roles: 2, active: true },
  { name: 'Reportes', roles: 4, active: true },
  { name: 'Departamentos', roles: 3, active: true },
  { name: 'Unidades', roles: 2, active: false },
  { name: 'Cargos', roles: 3, active: true },
];

// ─── CARD METRIC ────────────────────────────────────────────────────────────

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

// ─── ROLES DONUT ────────────────────────────────────────────────────────────

function RolesChart() {
  const options: ApexOptions = {
    chart: { type: 'donut', fontFamily: 'Outfit, sans-serif' },
    labels: ROLES.map((r) => r.name),
    colors: ROLES.map((r) => r.color),
    legend: { position: 'bottom', fontFamily: 'Outfit', fontSize: '13px' },
    dataLabels: { enabled: true, style: { fontSize: '12px' } },
    plotOptions: { pie: { donut: { size: '60%' } } },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v: number) => `${v} usuarios` } },
  };
  return <Chart options={options} series={ROLES.map((r) => r.users)} type="donut" height={260} />;
}

// ─── USERS BY UNIT (horizontal bar) ─────────────────────────────────────────

function UsersByUnitChart() {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#465fff'],
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, borderRadiusApplication: 'end', barHeight: '60%' },
    },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    xaxis: { categories: USERS_BY_UNIT.map((u) => u.unit), labels: { style: { fontSize: '12px' } } },
    grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    tooltip: { y: { formatter: (v: number) => `${v} usuarios` } },
  };
  return (
    <Chart
      options={options}
      series={[{ name: 'Usuarios', data: USERS_BY_UNIT.map((u) => u.count) }]}
      type="bar"
      height={260}
    />
  );
}

// ─── USERS MONTHLY (area) ───────────────────────────────────────────────────

function UsersMonthlyChart() {
  const options: ApexOptions = {
    chart: { type: 'area', fontFamily: 'Outfit, sans-serif', toolbar: { show: false }, sparkline: { enabled: false } },
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
  return (
    <Chart options={options} series={[{ name: 'Nuevos usuarios', data: USERS_MONTHLY }]} type="area" height={200} />
  );
}

// ─── CHARGES BY DEPT (column) ───────────────────────────────────────────────

function ChargesChart() {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#10b981'],
    plotOptions: {
      bar: { borderRadius: 4, borderRadiusApplication: 'end', columnWidth: '55%' },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: CHARGES_BY_DEPT.map((d) => d.dept),
      labels: { style: { fontSize: '11px' }, rotate: -35 },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (v: number) => `${v} cargos` } },
  };
  return (
    <Chart
      options={options}
      series={[{ name: 'Cargos', data: CHARGES_BY_DEPT.map((d) => d.charges) }]}
      type="bar"
      height={200}
    />
  );
}

// ─── PERMISSIONS TABLE ───────────────────────────────────────────────────────

function PermissionsTable() {
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
          {PERMISSIONS.map((p, i) => {
            const pct = Math.round((p.granted / (p.granted + p.denied)) * 100);
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

// ─── MENU ITEMS LIST ─────────────────────────────────────────────────────────

function MenuList() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {MENU_ITEMS.map((m, i) => (
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const AdminDashboard = () => {
  const [tab, setTab] = useState<'general' | 'permisos' | 'menu'>('general');

  const totalUsers = USERS_BY_UNIT.reduce((s, u) => s + u.count, 0);
  const totalRoles = ROLES.length;
  const totalDepts = CHARGES_BY_DEPT.length;
  const totalCharges = CHARGES_BY_DEPT.reduce((s, c) => s + c.charges, 0);

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
          {(['general', 'permisos', 'menu'] as const).map((t) => (
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
        <MetricCard icon="👤" label="Usuarios totales" value={totalUsers} sub="Activos en el sistema" color="#465fff" />
        <MetricCard icon="🔐" label="Roles definidos" value={totalRoles} sub="Niveles de acceso" color="#0ea5e9" />
        <MetricCard icon="🏢" label="Departamentos" value={68} sub="En todas las unidades" color="#10b981" />
        <MetricCard
          icon="💼"
          label="Cargos registrados"
          value={totalCharges + 560}
          sub="En 6 unidades acad."
          color="#f59e0b"
        />
      </div>

      {/* ── Tab: General ── */}
      {tab === 'general' && (
        <>
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Roles */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Distribución por rol</h3>
              <RolesChart />
            </div>
            {/* Users by Unit */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Usuarios por unidad académica
              </h3>
              <UsersByUnitChart />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Monthly Growth */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">
                Nuevos usuarios por mes (2024)
              </h3>
              <p className="mb-4 text-xs text-gray-400">Crecimiento acumulado del sistema</p>
              <UsersMonthlyChart />
            </div>
            {/* Charges by Dept */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">Cargos por departamento</h3>
              <p className="mb-4 text-xs text-gray-400">Puestos registrados (muestra)</p>
              <ChargesChart />
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
          <PermissionsTable />
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            * Basado en <code>role_has_permissions</code> y <code>permissions</code> del sistema.
          </p>
        </div>
      )}

      {/* ── Tab: Menu ── */}
      {tab === 'menu' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
            Ítems de menú y acceso por rol
          </h3>
          <MenuList />
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            * Basado en <code>menu_items</code> y <code>menu_item_role</code>.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
