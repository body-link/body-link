import React from 'react';
import { createIcon, IPropsIcon } from './utils';

export const IconChevron: React.FC<IPropsIcon> = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <path d="M12.293 5.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L8 9.586l4.293-4.293z" />
  ),
});
