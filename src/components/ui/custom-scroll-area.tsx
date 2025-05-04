import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const CustomScrollArea = forwardRef<HTMLDivElement, Props>(
  ({ children, className, ...props }: Props, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'overflow-auto',
          '[&::-webkit-scrollbar]:w-2',
          '[&::-webkit-scrollbar-track]:bg-muted/50',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CustomScrollArea.displayName = 'CustomScrollArea';

export default CustomScrollArea;
