import { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { CorrespDashboardData } from '../../../types/dashboard/dashboard.type.ts';
import { useCorrespDashboard } from '../../../hooks/useCorrespDashboard.ts';

// ─── Colores fijos para estados y prioridades (por índice) ───────────────────
const STATE_COLORS = ['#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6', '#6b7280', '#ef4444'];
const PRIORITY_COLORS = ['#0ea5e9', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];
const UNIT_COLORS = ['#465fff', '#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#6b7280'];

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
      <Skeleton className="h-56 w-full" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="col-span-2 h-48" />
      </div>
    </div>
  );
}

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
  trend,
  color = '#465fff',
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  trend?: { value: number; label: string };
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: color + '18' }}
        >
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              trend.value >= 0
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
            }`}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
      <div className="mt-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</h4>
        {sub && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

// ─── EstadoChart ─────────────────────────────────────────────────────────────

function EstadoChart({ data }: { data: CorrespDashboardData['docs_by_state'] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const colors = data.map((_, i) => STATE_COLORS[i % STATE_COLORS.length]);
  const options: ApexOptions = {
    chart: { type: 'donut', fontFamily: 'Outfit, sans-serif' },
    labels: data.map((s) => s.state),
    colors,
    legend: { position: 'bottom', fontFamily: 'Outfit', fontSize: '12px' },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    plotOptions: {
      pie: {
        donut: {
          size: '55%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => String(total),
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v: number) => `${v} docs` } },
  };
  return <Chart options={options} series={data.map((s) => s.count)} type="donut" height={260} />;
}

// ─── TipoChart ────────────────────────────────────────────────────────────────

function TipoChart({ data }: { data: CorrespDashboardData['docs_by_type'] }) {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#465fff'],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, borderRadiusApplication: 'end', barHeight: '65%' } },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    xaxis: {
      categories: data.map((t) => t.type),
      labels: { style: { fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    tooltip: { y: { formatter: (v: number) => `${v.toLocaleString()} documentos` } },
  };
  return (
    <Chart options={options} series={[{ name: 'Docs', data: data.map((t) => t.count) }]} type="bar" height={280} />
  );
}

// ─── MensualChart ─────────────────────────────────────────────────────────────

function MensualChart({ data }: { data: CorrespDashboardData['docs_monthly'] }) {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false }, stacked: false },
    colors: ['#465fff', '#10b981'],
    plotOptions: { bar: { borderRadius: 3, columnWidth: '70%', borderRadiusApplication: 'end' } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((m) => m.mes),
      labels: { style: { fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: { position: 'top', horizontalAlign: 'right', fontFamily: 'Outfit', fontSize: '12px' },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (v: number) => `${v} docs` } },
  };
  return (
    <Chart
      options={options}
      series={[
        { name: 'Entrada (I)', data: data.map((m) => m.entrada) },
        { name: 'Salida (E)', data: data.map((m) => m.salida) },
      ]}
      type="bar"
      height={220}
    />
  );
}

// Elimina etiquetas HTML del texto (ej: <span class="label-danger">URGENTE!</span>)
const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '').trim();

// ─── PriorityDisplay ─────────────────────────────────────────────────────────

function PriorityDisplay({ data }: { data: CorrespDashboardData['docs_by_priority'] }) {
  const total = data.reduce((s, p) => s + p.value, 0);
  return (
    <div className="flex flex-col gap-4">
      {data.map((p, i) => (
        <div key={i}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-white/80">{stripHtml(p.label)}</span>
            <span className="font-bold text-gray-800 dark:text-white/90">
              {p.value} ({total > 0 ? Math.round((p.value / total) * 100) : 0}%)
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${total > 0 ? (p.value / total) * 100 : 0}%`,
                backgroundColor: PRIORITY_COLORS[i % PRIORITY_COLORS.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── UnitCards ────────────────────────────────────────────────────────────────

function UnitCards({ data }: { data: CorrespDashboardData['docs_by_unit'] }) {
  const max = Math.max(...data.map((u) => u.docs), 1);
  return (
    <div className="grid grid-cols-3 gap-3">
      {data.map((u, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"
          style={{ borderLeftWidth: '3px', borderLeftColor: UNIT_COLORS[i % UNIT_COLORS.length] }}
        >
          <div className="text-sm font-semibold text-gray-700 dark:text-white/80">{u.unit}</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full"
              style={{ width: `${(u.docs / max) * 100}%`, backgroundColor: UNIT_COLORS[i % UNIT_COLORS.length] }}
            />
          </div>
          <div className="mt-1.5 text-lg font-bold text-gray-800 dark:text-white/90">{u.docs}</div>
          <div className="text-xs text-gray-400">documentos</div>
        </div>
      ))}
    </div>
  );
}

// ─── ResponseTimeChart ────────────────────────────────────────────────────────

function ResponseTimeChart({ data }: { data: CorrespDashboardData['response_time'] }) {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#8b5cf6'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', borderRadiusApplication: 'end' } },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    xaxis: {
      categories: data.map((r) => r.rango),
      labels: { style: { fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (v: number) => `${v} docs` } },
  };
  return (
    <Chart options={options} series={[{ name: 'Documentos', data: data.map((r) => r.docs) }]} type="bar" height={200} />
  );
}

// ─── TopDeptTable ─────────────────────────────────────────────────────────────

function TopDeptTable({ data }: { data: CorrespDashboardData['top_departments'] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Departamento</th>
            <th className="pb-3 text-center font-medium text-gray-500 dark:text-gray-400">Enviados</th>
            <th className="pb-3 text-center font-medium text-gray-500 dark:text-gray-400">Recibidos</th>
            <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
            const bal = d.sent - d.received;
            return (
              <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                <td className="py-2.5 font-medium text-gray-700 dark:text-white/80">{d.name}</td>
                <td className="py-2.5 text-center">
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {d.sent}
                  </span>
                </td>
                <td className="py-2.5 text-center">
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                    {d.received}
                  </span>
                </td>
                <td className="py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      bal > 0
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    }`}
                  >
                    {bal > 0 ? '+' : ''}
                    {bal}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── TimeKPIs (calculados dinámicamente desde response_time) ─────────────────

function TimeKPIs({ data }: { data: CorrespDashboardData['response_time'] }) {
  const total = data.reduce((s, r) => s + r.docs, 0);

  const lessThanOne = data.find((r) => r.rango === '< 1 día')?.docs ?? 0;
  const moreThan15 = data.find((r) => r.rango === '> 15 días')?.docs ?? 0;

  // Promedio ponderado aproximado (punto medio de cada rango)
  const midpoints: Record<string, number> = {
    '< 1 día': 0.5,
    '1–3 días': 2,
    '4–7 días': 5.5,
    '8–15 días': 11.5,
    '> 15 días': 20,
  };
  const avgDays =
    total > 0 ? (data.reduce((s, r) => s + (midpoints[r.rango] ?? 0) * r.docs, 0) / total).toFixed(1) : '0';

  const slaCount = data
    .filter((r) => !r.rango.startsWith('> 15') && r.rango !== '8–15 días')
    .reduce((s, r) => s + r.docs, 0);
  const sla = total > 0 ? Math.round((slaCount / total) * 100) : 0;

  const kpis = [
    { label: 'Promedio de atención', value: `${avgDays} días`, color: '#465fff' },
    {
      label: 'Docs. atendidos < 24 hs',
      value: total > 0 ? `${Math.round((lessThanOne / total) * 100)}%` : '0%',
      color: '#0ea5e9',
    },
    {
      label: 'Docs. > 15 días',
      value: total > 0 ? `${Math.round((moreThan15 / total) * 100)}%` : '0%',
      color: '#ef4444',
    },
    { label: 'SLA cumplido (≤ 7 días)', value: `${sla}%`, color: '#8b5cf6' },
    { label: 'Total documentos analizados', value: total.toLocaleString(), color: '#10b981' },
  ];

  return (
    <div className="space-y-4">
      {kpis.map((item, i) => (
        <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/[0.02]">
          <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
          <span className="text-base font-bold" style={{ color: item.color }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export const CorrespDashboard = () => {
  const { data, loading, error, refetch } = useCorrespDashboard();
  const [tab, setTab] = useState<'general' | 'departamentos' | 'tiempos'>('general');

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorCard message={error ?? 'Sin datos'} onRetry={refetch} />;

  const {
    metrics,
    docs_by_state,
    docs_by_type,
    docs_by_priority,
    docs_monthly,
    docs_by_unit,
    response_time,
    top_departments,
  } = data;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Dashboard Correspondencia</h2>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
            Documentos, rutas, estados y tiempos de respuesta · {new Date().getFullYear()}
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          {(['general', 'departamentos', 'tiempos'] as const).map((t) => (
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
          icon="📄"
          label={`Docs. totales ${new Date().getFullYear()}`}
          value={metrics.total_docs.toLocaleString()}
          sub="Entrada + salida"
          color="#465fff"
        />
        <MetricCard icon="⏳" label="Pendientes" value={metrics.pendientes} sub="Requieren atención" color="#f59e0b" />
        <MetricCard
          icon="✅"
          label="Eficiencia"
          value={`${metrics.eficiencia}%`}
          sub="Docs. atendidos / total"
          color="#10b981"
        />
        <MetricCard
          icon="🔁"
          label="Rutas generadas"
          value={metrics.total_routers.toLocaleString()}
          sub="Derivaciones registradas"
          color="#8b5cf6"
        />
      </div>

      {/* ── Tab: General ── */}
      {tab === 'general' && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Documentos por estado</h3>
              <EstadoChart data={docs_by_state} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Documentos por tipo</h3>
              <TipoChart data={docs_by_type} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">
              Documentos recibidos vs. generados por mes
            </h3>
            <p className="mb-4 text-xs text-gray-400">Flujo mensual · (I) Internos + (E) Externos</p>
            <MensualChart data={docs_monthly} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">Por prioridad</h3>
              <PriorityDisplay data={docs_by_priority} />
            </div>
            <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Volumen por unidad académica
              </h3>
              <UnitCards data={docs_by_unit} />
            </div>
          </div>
        </>
      )}

      {/* ── Tab: Departamentos ── */}
      {tab === 'departamentos' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
            Top departamentos por flujo de correspondencia
          </h3>
          <TopDeptTable data={top_departments} />
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Balance = Enviados − Recibidos. Positivo: mayor generación. Negativo: mayor recepción.
          </p>
        </div>
      )}

      {/* ── Tab: Tiempos ── */}
      {tab === 'tiempos' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">
              Tiempo de respuesta / atención
            </h3>
            <p className="mb-4 text-xs text-gray-400">Días entre creación y última actualización</p>
            <ResponseTimeChart data={response_time} />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">Indicadores de tiempos</h3>
            <TimeKPIs data={response_time} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrespDashboard;
