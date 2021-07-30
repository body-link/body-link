import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconArrow: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.703 4.293L15.41 8l-3.707 3.707a1 1 0 0 1-1.414-1.414L11.582 9H1.996a1 1 0 0 1 0-2h9.586l-1.293-1.293a1 1 0 1 1 1.414-1.414z"
    />
  ),
});
