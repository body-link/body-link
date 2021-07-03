import React from 'react';
import { Meta, Story } from '@storybook/react';
import { IPropsOverlayArrow, OverlayArrow } from './OverlayArrow';
import { EThemeColorSetName } from '../../../theme';
import { Box } from '../../layout/Box/Box';

export default {
  title: 'Utils/OverlayArrow',
  component: OverlayArrow,
  argTypes: {
    colorSetName: {
      control: {
        type: 'select',
      },
      options: Object.values(EThemeColorSetName),
    },
  },
  args: {
    size: 24,
    colorSetName: EThemeColorSetName.White,
  },
} as Meta;

export const Basic: Story<IPropsOverlayArrow> = ({ size, colorSetName }) => {
  return (
    <Box p={3} data-popper-placement="top">
      <OverlayArrow size={size} colorSetName={colorSetName} />
    </Box>
  );
};
