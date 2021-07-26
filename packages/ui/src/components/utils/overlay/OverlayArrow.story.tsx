import React from 'react';
import { Meta, Story } from '@storybook/react';
import { IPropsOverlayArrow, OverlayArrow } from './OverlayArrow';
import { Box } from '../../layout/Box/Box';

export default {
  title: 'Utils/OverlayArrow',
  component: OverlayArrow,
} as Meta;

export const Basic: Story<IPropsOverlayArrow> = (props) => {
  return (
    <Box p={3} data-popper-placement="top">
      <OverlayArrow {...props} />
    </Box>
  );
};
