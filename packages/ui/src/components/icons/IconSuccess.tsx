import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconSuccess: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM6.5 9.67l5.309-5.309L13.2 5.8 6.5 12.5 2.793 8.793 4.205 7.38 6.5 9.67z"
    />
  ),
});
