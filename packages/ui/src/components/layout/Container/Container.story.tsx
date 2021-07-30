import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box } from '../Box/Box';
import { Container, IPropsContainer } from './Container';

export default {
  title: 'Layout/Container',
  component: Container,
  args: {
    hasBorder: true,
    isHoverable: true,
    isElevated: true,
    p: 2,
  },
} as Meta;

export const Basic: Story<IPropsContainer> = (props) => {
  return (
    <Box p={6}>
      <Container {...props}>Content</Container>
    </Box>
  );
};
