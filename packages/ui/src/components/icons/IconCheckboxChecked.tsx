import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconCheckboxChecked: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <>
      <path fillRule="evenodd" clipRule="evenodd" d="M14 2H2v12h12V2zM0 0v16h16V0H0z" />
      <path d="M6.827 8.788l4.36-4.641a.45.45 0 0 1 .665 0l1.01 1.076a.524.524 0 0 1 0 .708l-5.465 5.818a.772.772 0 0 1-1.14 0l-3.12-3.32a.524.524 0 0 1 0-.709l1.011-1.076a.45.45 0 0 1 .665 0l2.014 2.144z" />
    </>
  ),
});
