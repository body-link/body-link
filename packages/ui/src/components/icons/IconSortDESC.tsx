import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconSortDESC: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <>
      <g clipPath="url(#a)">
        <path d="M.293 11.707L3 14.414l2.707-2.707a1 1 0 1 0-1.414-1.414L4 10.586V3a1 1 0 1 0-2 0v7.586l-.293-.293a1 1 0 1 0-1.414 1.414zM9 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9zM8 8a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1zM9 11a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2H9z" />
      </g>
      <defs>
        <clipPath id="a">
          <path d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </>
  ),
});
