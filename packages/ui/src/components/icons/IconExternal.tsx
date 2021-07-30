import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconExternal: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <>
      <path
        fillRule="evenodd"
        d="M8.5 2h4c.28 0 .5.22.5.5v4a.5.5 0 0 1-1 0V3.7L7.7 8 7 7.3 11.3 3H8.5a.5.5 0 0 1 0-1z"
        clipRule="evenodd"
      />
      <path d="M7 4H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8h1v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h2v1z" />
    </>
  ),
});
