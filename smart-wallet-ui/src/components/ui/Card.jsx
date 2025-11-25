import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={twMerge(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}