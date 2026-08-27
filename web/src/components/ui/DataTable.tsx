
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({ data, columns, isLoading, emptyMessage, className }: DataTableProps<T>) {
  const { t } = useTranslation();

  return (
    <div className={cn("w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-text dark:text-text-dark">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {columns.map((col, index) => (
                <th key={index} scope="col" className="px-6 py-3 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ms-2">{t('loading')}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-text-muted dark:text-text-mutedDark">
                  {emptyMessage || t('no_data')}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="bg-surface dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {col.cell ? col.cell(row) : (row as any)[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
