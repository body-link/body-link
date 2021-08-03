import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { IInputEvents, useInputEvents } from './useInputEvents';
import { Box } from '../../layout/Box/Box';
import { Input } from '../../actions-and-inputs/Input/Input';

export default {
  title: 'Utils/useInputEvents',
} as Meta;

export const AllEvents: Story = () => {
  const [value, setValue] = useState('');
  const { current: events } = React.useRef<IInputEvents>({
    onFocus: action('onFocus'),
    onBlur: action('onBlur'),
    onZoom: action('onZoom'),
  });
  const { ref } = useInputEvents(events);
  return (
    <Box p={2}>
      <Input inputProps={{ ref }} value={value} onChange={setValue} placeholder="onFocus, onBlur, onZoom" />
    </Box>
  );
};
