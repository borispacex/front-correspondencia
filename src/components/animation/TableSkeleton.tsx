interface Props {
  rows?: number;
  cols?: number;
}

export default function TableSkeleton({ rows = 8, cols = 9 }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, row) => (
        <tr key={row} className="border-b border-gray-100 dark:border-white/[0.05]">
          {Array.from({ length: cols }).map((_, col) => (
            <td key={col} className="px-4 py-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
