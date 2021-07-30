import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconMore: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <path d="M8 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 4a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
  ),
});
