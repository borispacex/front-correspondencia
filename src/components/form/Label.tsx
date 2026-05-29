import { FC, ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface LabelProps {
  htmlFor?: string;

  children: ReactNode;

  className?: string;

  size?: 'xs' | 'sm' | 'md';
}

const Label: FC<LabelProps> = ({ htmlFor, children, className, size = 'md' }) => {
  const sizeClasses = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        twMerge(`mb-1.5 block font-medium text-gray-700 dark:text-gray-400 ${sizeClasses[size]} `, className),
      )}
    >
      {children}
    </label>
  );
};

export default Label;
