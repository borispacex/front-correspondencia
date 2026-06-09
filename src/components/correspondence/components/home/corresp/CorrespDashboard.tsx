import { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// ─── DATA (basada en documentos reales del Excel) ───────────────────────────

const DOCS_BY_STATE = [
  { state: 'Atendido', count: 124, color: '#10b981' },
  { state: 'Pendiente', count: 38, color: '#f59e0b' },
  { state: 'En proceso', count: 22, color: '#0ea5e9' },
  { state: 'Derivado', count: 15, color: '#8b5cf6' },
  { state: 'Archivado', count: 9, color: '#6b7280' },
  { state: 'Anulado', count: 3, color: '#ef4444' },
];

const DOCS_BY_TYPE = [
  { type: 'Informe (INF)', count: 1450 },
  { type: 'Oficio (OF)', count: 820 },
  { type: 'Memorándum', count: 390 },
  { type: 'Nota de servicio', count: 280 },
  { type: 'Solicitud', count: 210 },
  { type: 'Radiograma', count: 175 },
  { type: 'Resolución', count: 88 },
  { type: 'Otro', count: 145 },
];

const DOCS_BY_PRIORITY = [
  { label: 'Normal', value: 198, color: '#0ea5e9' },
  { label: 'Urgente', value: 13, color: '#ef4444' },
];

const DOCS_MONTHLY = [
  { mes: 'Ene', entrada: 180, salida: 145 },
  { mes: 'Feb', entrada: 210, salida: 178 },
  { mes: 'Mar', entrada: 198, salida: 162 },
  { mes: 'Abr', entrada: 225, salida: 190 },
  { mes: 'May', entrada: 242, salida: 205 },
  { mes: 'Jun', entrada: 215, salida: 188 },
  { mes: 'Jul', entrada: 230, salida: 199 },
  { mes: 'Ago', entrada: 248, salida: 210 },
  { mes: 'Sep', entrada: 260, salida: 222 },
  { mes: 'Oct', entrada: 235, salida: 200 },
  { mes: 'Nov', entrada: 218, salida: 185 },
  { mes: 'Dic', entrada: 195, salida: 167 },
];

const DOCS_BY_UNIT = [
  { unit: 'UALP', docs: 412 },
  { unit: 'UASC', docs: 388 },
  { unit: 'UACBBA', docs: 364 },
  { unit: 'Nacional', docs: 290 },
  { unit: 'UAT', docs: 198 },
  { unit: 'UAR', docs: 142 },
];

const RESPONSE_TIME = [
  { rango: '< 1 día', docs: 45 },
  { rango: '1–3 días', docs: 78 },
  { rango: '4–7 días', docs: 52 },
  { rango: '8–15 días', docs: 28 },
  { rango: '> 15 días', docs: 9 },
];

const TOP_DEPARTMENTS = [
  { name: 'Rectorado', sent: 48, received: 312 },
  { name: 'DNAA Financiero', sent: 218, received: 180 },
  { name: 'Dir. Planificación', sent: 142, received: 195 },
  { name: 'Dir. Posgrado CBBA', sent: 185, received: 160 },
  { name: 'UAAF UASC', sent: 164, received: 148 },
  { name: 'Dir. Tecnológico', sent: 132, received: 140 },
];

// ─── CARD METRIC ────────────────────────────────────────────────────────────

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

// ─── ESTADO DOCS (donut) ─────────────────────────────────────────────────────

function EstadoChart() {
  const options: ApexOptions = {
    chart: { type: 'donut', fontFamily: 'Outfit, sans-serif' },
    labels: DOCS_BY_STATE.map((s) => s.state),
    colors: DOCS_BY_STATE.map((s) => s.color),
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
              formatter: () => String(DOCS_BY_STATE.reduce((s, d) => s + d.count, 0)),
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    tooltip: { y: { formatter: (v: number) => `${v} docs` } },
  };
  return <Chart options={options} series={DOCS_BY_STATE.map((s) => s.count)} type="donut" height={260} />;
}

// ─── TIPO DOCS (horizontal bar) ─────────────────────────────────────────────

function TipoChart() {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#465fff'],
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, borderRadiusApplication: 'end', barHeight: '65%' },
    },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    xaxis: {
      categories: DOCS_BY_TYPE.map((t) => t.type),
      labels: { style: { fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    tooltip: { y: { formatter: (v: number) => `${v.toLocaleString()} documentos` } },
  };
  return (
    <Chart
      options={options}
      series={[{ name: 'Docs', data: DOCS_BY_TYPE.map((t) => t.count) }]}
      type="bar"
      height={280}
    />
  );
}

// ─── MENSUAL ENTRADA/SALIDA ──────────────────────────────────────────────────

function MensualChart() {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false }, stacked: false },
    colors: ['#465fff', '#10b981'],
    plotOptions: { bar: { borderRadius: 3, columnWidth: '70%', borderRadiusApplication: 'end' } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: DOCS_MONTHLY.map((m) => m.mes),
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
        { name: 'Entrada (I)', data: DOCS_MONTHLY.map((m) => m.entrada) },
        { name: 'Salida (E)', data: DOCS_MONTHLY.map((m) => m.salida) },
      ]}
      type="bar"
      height={220}
    />
  );
}

// ─── DOCS BY UNIT (treemap-style cards) ─────────────────────────────────────

function UnitCards() {
  const max = Math.max(...DOCS_BY_UNIT.map((u) => u.docs));
  const colors = ['#465fff', '#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#6b7280'];
  return (
    <div className="grid grid-cols-3 gap-3">
      {DOCS_BY_UNIT.map((u, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"
          style={{ borderLeftWidth: '3px', borderLeftColor: colors[i] }}
        >
          <div className="text-sm font-semibold text-gray-700 dark:text-white/80">{u.unit}</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full"
              style={{ width: `${(u.docs / max) * 100}%`, backgroundColor: colors[i] }}
            />
          </div>
          <div className="mt-1.5 text-lg font-bold text-gray-800 dark:text-white/90">{u.docs}</div>
          <div className="text-xs text-gray-400">documentos</div>
        </div>
      ))}
    </div>
  );
}

// ─── TIEMPO DE RESPUESTA ─────────────────────────────────────────────────────

function ResponseTimeChart() {
  const options: ApexOptions = {
    chart: { type: 'bar', fontFamily: 'Outfit, sans-serif', toolbar: { show: false } },
    colors: ['#8b5cf6'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', borderRadiusApplication: 'end' } },
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    xaxis: {
      categories: RESPONSE_TIME.map((r) => r.rango),
      labels: { style: { fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { yaxis: { lines: { show: true } } },
    tooltip: { y: { formatter: (v: number) => `${v} docs` } },
  };
  return (
    <Chart
      options={options}
      series={[{ name: 'Documentos', data: RESPONSE_TIME.map((r) => r.docs) }]}
      type="bar"
      height={200}
    />
  );
}

// ─── PRIORITY PILLS ──────────────────────────────────────────────────────────

function PriorityDisplay() {
  const total = DOCS_BY_PRIORITY.reduce((s, p) => s + p.value, 0);
  return (
    <div className="flex flex-col gap-4">
      {DOCS_BY_PRIORITY.map((p, i) => (
        <div key={i}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-white/80">{p.label}</span>
            <span className="font-bold text-gray-800 dark:text-white/90">
              {p.value} ({Math.round((p.value / total) * 100)}%)
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TOP DEPARTMENTS TABLE ───────────────────────────────────────────────────

function TopDeptTable() {
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
          {TOP_DEPARTMENTS.map((d, i) => {
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const CorrespDashboard = () => {
  const [tab, setTab] = useState<'general' | 'departamentos' | 'tiempos'>('general');

  const totalDocs = DOCS_MONTHLY.reduce((s, m) => s + m.entrada + m.salida, 0);
  const pendientes = DOCS_BY_STATE.find((s) => s.state === 'Pendiente')?.count ?? 0;
  const atendidos = DOCS_BY_STATE.find((s) => s.state === 'Atendido')?.count ?? 0;
  const eficiencia = Math.round((atendidos / DOCS_BY_STATE.reduce((s, d) => s + d.count, 0)) * 100);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Dashboard Correspondencia</h2>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
            Documentos, rutas, estados y tiempos de respuesta · EMI 2024
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
          label="Docs. totales 2024"
          value={totalDocs.toLocaleString()}
          sub="Entrada + salida"
          color="#465fff"
          trend={{ value: 12, label: 'vs 2023' }}
        />
        <MetricCard
          icon="⏳"
          label="Pendientes"
          value={pendientes}
          sub="Requieren atención"
          color="#f59e0b"
          trend={{ value: -8, label: 'vs mes ant.' }}
        />
        <MetricCard
          icon="✅"
          label="Eficiencia"
          value={`${eficiencia}%`}
          sub="Docs. atendidos / total"
          color="#10b981"
          trend={{ value: 5, label: 'vs trim. ant.' }}
        />
        <MetricCard icon="🔁" label="Rutas generadas" value="4,820" sub="Derivaciones registradas" color="#8b5cf6" />
      </div>

      {/* ── Tab: General ── */}
      {tab === 'general' && (
        <>
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Estado */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Documentos por estado</h3>
              <EstadoChart />
            </div>
            {/* Tipo */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Documentos por tipo</h3>
              <TipoChart />
            </div>
          </div>

          {/* Row 2: Mensual full-width */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">
              Documentos recibidos vs. generados por mes
            </h3>
            <p className="mb-4 text-xs text-gray-400">Flujo mensual 2024 · (I) Internos + (E) Externos</p>
            <MensualChart />
          </div>

          {/* Row 3: Priority + Units */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Priority */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">Por prioridad</h3>
              <PriorityDisplay />
              <p className="mt-4 text-xs text-gray-400">Urgente: documentos con prioridad_id = 1</p>
            </div>
            {/* Units */}
            <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Volumen por unidad académica
              </h3>
              <UnitCards />
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
          <TopDeptTable />
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
            <p className="mb-4 text-xs text-gray-400">Días entre creación y atención del documento</p>
            <ResponseTimeChart />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
              Indicadores de tiempos (2024)
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Promedio de atención', value: '3.8 días', color: '#465fff' },
                { label: 'Mediana de respuesta', value: '2.1 días', color: '#10b981' },
                { label: 'Docs. < 24 hs', value: '21%', color: '#0ea5e9' },
                { label: 'Docs. > 15 días', value: '4%', color: '#ef4444' },
                { label: 'SLA cumplido (≤ 7 días)', value: '83%', color: '#8b5cf6' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/[0.02]"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                  <span className="text-base font-bold" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrespDashboard;
