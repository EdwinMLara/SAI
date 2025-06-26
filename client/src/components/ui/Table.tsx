import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TableColumn<T> {
  key: keyof T;
  label?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T extends object> {
  data: T[];
  columns?: Array<TableColumn<T>>;
  className?: string;
}

function getColumns<T extends object>(
  data: T[],
  columns?: TableColumn<T>[]
): TableColumn<T>[] {
  if (columns && columns.length > 0) return columns;
  if (data.length === 0) return [];
  return Object.keys(data[0]).map((key) => ({
    key: key as keyof T,
    label: undefined,
  }));
}

function Table<T extends object>({
  data,
  columns,
  className = '',
}: TableProps<T>) {
  const cols = getColumns(data, columns);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const totalRows = data.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div
      className={`w-full max-w-full border-2 border-gray-200 bg-white p-0 font-sans text-main ${className}`.trim()}
      style={{
        minWidth: 0,
        borderRadius: '0.375rem',
        overflow: 'hidden',
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        color: '#181a1b',
      }}
    >
      <div
        className="overflow-x-auto custom-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100%',
          background: 'transparent',
          border: 'none',
        }}
      >
        <table
          className="w-full text-xs border-separate border-spacing-0"
          style={
            {
              '--row-height': '36px',
              tableLayout: 'auto',
              minWidth: '100%',
              wordBreak: 'break-all',
            } as React.CSSProperties
          }
        >
          <thead>
            <tr className="bg-gray-50">
              {cols.map((col, idx) => (
                <th
                  key={String(col.key)}
                  className={`px-3 py-2 text-center font-semibold text-main capitalize tracking-wide border-b-2 border-gray-200 ${
                    idx < cols.length - 1 ? 'border-r-2 border-gray-200' : ''
                  }`}
                  style={{ letterSpacing: 0.5, whiteSpace: 'nowrap' }}
                >
                  {(col.label || String(col.key))
                    .split(' ')
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={cols.length}
                  className="px-2 py-6 text-center text-gray-300 text-xs font-medium bg-white border-b border-gray-200"
                >
                  Sin datos
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {paginatedData.map((row, i) => (
                  <motion.tr
                    key={i}
                    className={`transition-colors ${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100 duration-100`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                  >
                    {cols.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-2 py-2 text-main border-b border-gray-200 align-middle"
                        style={{ wordBreak: 'break-all', whiteSpace: 'nowrap' }}
                      >
                        {typeof col.render === 'function' ? (
                          col.render(
                            row[col.key],
                            row,
                            (page - 1) * rowsPerPage + i
                          )
                        ) : row[col.key] === undefined ||
                          row[col.key] === null ||
                          row[col.key] === '' ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          String(row[col.key])
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-1 mt-2 px-2 pb-2">
        <div className="flex items-center gap-1 w-full md:w-auto md:justify-start justify-center mb-1 md:mb-0">
          <span className="text-[11px] text-gray-600">Filas por página:</span>
          <select
            className="border border-gray-300 rounded px-1 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            value={rowsPerPage}
            onChange={handleRowsPerPage}
          >
            {(() => {
              const scales = [5, 10, 15, 20, 50, 100];
              const options: { value: number; label: string }[] = [];
              for (const n of scales) {
                if (n < totalRows) options.push({ value: n, label: String(n) });
              }
              if (totalRows > 0) {
                options.push({ value: totalRows, label: 'Todas' });
              }
              if (totalRows > 0 && totalRows < 5) {
                return [
                  <option key={totalRows} value={totalRows}>
                    {totalRows}
                  </option>,
                ];
              }
              return options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ));
            })()}
          </select>
        </div>
        <div className="flex items-center gap-1 w-full md:w-auto md:justify-center justify-center">
          <button
            className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-40 hover:bg-gray-300 transition text-xs"
            onClick={handlePrev}
            disabled={page === 1}
            aria-label="Anterior"
          >
            &lt;
          </button>
          <span className="text-[11px] text-gray-600">
            Página {page} de {totalPages}
          </span>
          <button
            className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-40 hover:bg-gray-300 transition text-xs"
            onClick={handleNext}
            disabled={page === totalPages}
            aria-label="Siguiente"
          >
            &gt;
          </button>
        </div>
        <div className="text-[10px] text-gray-400">
          Mostrando {totalRows === 0 ? 0 : (page - 1) * rowsPerPage + 1}-
          {Math.min(page * rowsPerPage, totalRows)} de {totalRows}
        </div>
      </div>
    </div>
  );
}

export default Table;
