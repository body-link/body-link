import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconEdit: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <>
      <path d="M14.781 1.218a1 1 0 0 1 0 1.415l-.707.707-1.414-1.414.707-.708a1 1 0 0 1 1.414 0zM6 8.586l5.953-5.953 1.414 1.414L7.414 10H6V8.586z" />
      <path d="M4 2h4a1 1 0 1 1 0 2H4v8h8V8a1 1 0 1 1 2 0v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    </>
  ),
});
