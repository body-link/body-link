import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box } from '../../layout/Box/Box';
import { InputTransparent, IPropsInputTransparent } from './InputTransparent';

export default {
  title: 'Actions & Inputs/InputTransparent',
  component: InputTransparent,
} as Meta;

export const Basic: Story<IPropsInputTransparent> = (props) => {
  return (
    <Box p={2}>
      <InputTransparent placeholder="Placeholder" {...props} />
    </Box>
  );
};
