import React, { useState } from 'react';

const cn = (...args: any[]) => args.filter(Boolean).join(' ');

interface SampleSplitterProps {
  id?: string;
  dir: string;
  isDragging: boolean;
  [key: string]: any;
}

const SampleSplitter: React.FC<SampleSplitterProps> = ({
  id = 'drag-bar',
  dir,
  isDragging,
  ...props
}) => {
  return (
    <div
      id={id}
      data-testid={id}
      tabIndex={0}
      className={cn(
        'flex-shrink-0 bg-custom-gray z-10 cursor-col-resize transition-colors duration-150 ease-in-out',
        dir === 'horizontal' ? 'h-1 w-full cursor-row-resize bg-zinc-600   hover:h-[6px] hover:bg-blue-600 ' : 'w-1 h-full',
      )}
      {...props}
    />
  );
};

export default SampleSplitter;
