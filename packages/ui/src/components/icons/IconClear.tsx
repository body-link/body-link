import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconClear: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM3.5 4.5l1-1L8 7l3.5-3.5 1 1L9 8l3.5 3.5-1 1L8 9l-3.5 3.5-1-1L7 8 3.5 4.5z"
    />
  ),
});
