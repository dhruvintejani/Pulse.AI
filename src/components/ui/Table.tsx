import { forwardRef, memo } from 'react';
import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="max-w-full overflow-x-auto overscroll-x-contain ds-scrollbar">
    <table ref={ref} className={cn('w-full min-w-[640px] caption-bottom text-sm', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b [&_tr]:border-[var(--ds-color-border)]', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn('border-t border-[var(--ds-color-border)] bg-[var(--ds-color-surface-muted)] font-medium', className)} {...props} />
));
TableFooter.displayName = 'TableFooter';

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('border-b border-[var(--ds-color-border)] transition-colors hover:bg-[var(--ds-color-accent-soft)] data-[state=selected]:bg-[var(--ds-color-accent-soft)] motion-reduce:transition-none', className)} {...props} />
));
TableRow.displayName = 'TableRow';

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} scope={props.scope ?? 'col'} className={cn('h-11 whitespace-nowrap px-4 text-left align-middle text-[10px] font-black uppercase tracking-[0.18em] text-[var(--ds-color-subtle)]', className)} {...props} />
));
TableHead.displayName = 'TableHead';

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3 align-middle text-sm text-[var(--ds-color-muted)]', className)} {...props} />
));
TableCell.displayName = 'TableCell';

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-[var(--ds-color-subtle)]', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

const MemoTable = memo(Table);
const MemoTableHeader = memo(TableHeader);
const MemoTableBody = memo(TableBody);
const MemoTableFooter = memo(TableFooter);
const MemoTableRow = memo(TableRow);
const MemoTableHead = memo(TableHead);
const MemoTableCell = memo(TableCell);
const MemoTableCaption = memo(TableCaption);

export {
  MemoTable as Table,
  MemoTableHeader as TableHeader,
  MemoTableBody as TableBody,
  MemoTableFooter as TableFooter,
  MemoTableRow as TableRow,
  MemoTableHead as TableHead,
  MemoTableCell as TableCell,
  MemoTableCaption as TableCaption,
};

export default MemoTable;
