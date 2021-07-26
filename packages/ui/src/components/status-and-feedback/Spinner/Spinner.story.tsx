import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box } from '../../layout/Box/Box';
import { Spinner, IPropsSpinner } from './Spinner';

export default {
  title: 'Status & Feedback/Spinner',
  component: Spinner,
  argTypes: {
    color: { control: { type: 'color' } },
    size: { control: { type: 'number' } },
  },
} as Meta;

export const Basic: Story<IPropsSpinner> = (props) => {
  return (
    <Box p={2}>
      <Spinner {...props} />
    </Box>
  );
};
