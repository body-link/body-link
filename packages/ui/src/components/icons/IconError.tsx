import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconError: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 15H2l-2-2v-2L7 0h2l7 11v2l-2 2zM7 4h2v5H7V4zm0 7h2v2H7v-2z"
    />
  ),
});
