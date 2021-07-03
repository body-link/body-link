import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box, IPropsBox } from './Box';

export default {
  title: 'Layout/Box',
  component: Box,
} as Meta;

export const Basic: Story<IPropsBox> = () => {
  return (
    <Box p={2}>
      <Box w={3} h={3} style={{ backgroundColor: 'coral' }} />
      <Box w={3} h="50px" m={[2, 0, 0]} style={{ backgroundColor: 'black' }} />
      <Box w={3.5} h={5.25} mt={1} style={{ backgroundColor: 'blue' }} />
    </Box>
  );
};
