import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box } from '../../layout/Box/Box';
import { Input, IPropsInput } from './Input';
import { action } from '@storybook/addon-actions';
import { InputContainerButtonIcon } from '../InputContainer/InputContainerButtonIcon';
import { IconPlus } from '../../icons/IconPlus';
import { IconMinus } from '../../icons/IconMinus';
import { IconChevron } from '../../icons/IconChevron';

export default {
  title: 'Actions & Inputs/Input',
  component: Input,
} as Meta;

const Basic: Story<IPropsInput> = (props) => {
  const [value, setValue] = React.useState(props.value);
  return (
    <Box p={2}>
      <Input {...props} value={value} onChange={setValue} />
    </Box>
  );
};

// eslint-disable-next-line @rushstack/typedef-var
export const Empty = Basic.bind({});
Empty.args = {
  value: '',
};

// eslint-disable-next-line @rushstack/typedef-var
export const WithContent = Basic.bind({});
WithContent.args = {
  value: 'With Content',
};

// eslint-disable-next-line @rushstack/typedef-var
export const WithPlaceholder = Basic.bind({});
WithPlaceholder.args = {
  value: '',
  placeholder: "I'm placeholder",
};

// eslint-disable-next-line @rushstack/typedef-var
export const InvalidValueOrError = Basic.bind({});
InvalidValueOrError.args = {
  value: 'Invalid value or error',
  isInvalid: true,
};

// eslint-disable-next-line @rushstack/typedef-var
export const WithError = Basic.bind({});
WithError.args = {
  value: 'Content',
  isInvalid: true,
  error: 'This is a compact error message',
};

// eslint-disable-next-line @rushstack/typedef-var
export const Disabled = Basic.bind({});
Disabled.args = {
  value: 'Disabled',
  isDisabled: true,
  hasClearButton: true,
  error: 'This is a compact error message',
};

// eslint-disable-next-line @rushstack/typedef-var
export const ReadOnly = Basic.bind({});
ReadOnly.args = {
  value: 'Read Only',
  isReadOnly: true,
};

// eslint-disable-next-line @rushstack/typedef-var
export const HasClearButton = Basic.bind({});
HasClearButton.args = {
  value: 'Clear me with button -->',
  hasClearButton: true,
  onClearButtonClick: action('onClearButtonClick'),
};

// eslint-disable-next-line @rushstack/typedef-var
export const IsLoading = Basic.bind({});
IsLoading.args = {
  value: 'Content',
  isLoading: true,
};

// eslint-disable-next-line @rushstack/typedef-var
export const WithRightSide = Basic.bind({});
WithRightSide.args = {
  value: 'Content',
  rightSide: (
    <>
      <InputContainerButtonIcon>
        <IconMinus />
      </InputContainerButtonIcon>
      <InputContainerButtonIcon>
        <IconPlus />
      </InputContainerButtonIcon>
      <InputContainerButtonIcon>
        <IconChevron />
      </InputContainerButtonIcon>
    </>
  ),
};
