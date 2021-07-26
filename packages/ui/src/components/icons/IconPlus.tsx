import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconPlus: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <path d="M8 2a1 1 0 0 0-1 1v4H3a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0V9h4a1 1 0 1 0 0-2H9V3a1 1 0 0 0-1-1z" />
  ),
});
