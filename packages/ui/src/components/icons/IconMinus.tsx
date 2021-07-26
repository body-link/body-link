import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconMinus: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: <path d="M2 8a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1z" />,
});
