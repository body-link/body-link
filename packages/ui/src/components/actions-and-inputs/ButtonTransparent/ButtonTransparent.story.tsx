import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box } from '../../layout/Box/Box';
import { ButtonTransparent, IPropsButtonTransparent } from './ButtonTransparent';

export default {
  title: 'Actions & Inputs/ButtonTransparent',
  component: ButtonTransparent,
} as Meta;

export const Basic: Story<IPropsButtonTransparent> = (props) => {
  return (
    <Box p={2}>
      <ButtonTransparent {...props}>Button content</ButtonTransparent>
    </Box>
  );
};
