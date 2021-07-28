import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconCheckboxIndeterminate: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <>
      <path fillRule="evenodd" clipRule="evenodd" d="M14 2H2v12h12V2zM0 0v16h16V0H0z" />
      <path d="M4 7h8v2H4V7z" />
    </>
  ),
});
