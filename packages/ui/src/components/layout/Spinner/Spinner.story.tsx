import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box } from '../Box/Box';
import { Spinner, IPropsSpinner } from './Spinner';

export default {
  title: 'Layout/Spinner',
  component: Spinner,
  argTypes: {
    color: { control: { type: 'color' } },
  },
  args: {
    color: '#000',
    size: 4,
  },
} as Meta;

export const Basic: Story<IPropsSpinner> = (props) => {
  return (
    <Box p={2}>
      <Spinner {...props} />
    </Box>
  );
};
