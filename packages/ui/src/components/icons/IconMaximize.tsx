import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconMaximize: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: <path d="M12 4H4v8h8V4zM3 3v10h10V3H3z" fillRule="evenodd" clipRule="evenodd" />,
});
