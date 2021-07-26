import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box } from '../../layout/Box/Box';
import { InputContainer, IPropsInputContainer } from './InputContainer';

export default {
  title: 'Actions & Inputs/InputContainer',
  component: InputContainer,
  args: {
    isInvalid: false,
    isReadOnly: false,
  },
} as Meta;

export const Basic: Story<IPropsInputContainer> = (props) => {
  return (
    <Box p={2}>
      <InputContainer {...props} />
    </Box>
  );
};
