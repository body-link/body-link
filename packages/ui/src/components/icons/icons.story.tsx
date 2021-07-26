import React from 'react';
import { Meta, Story } from '@storybook/react';
import { IPropsIcon } from './utils';
import { IconClear } from './IconClear';
import { Box } from '../layout/Box/Box';
import { Stack } from '../layout/Stack/Stack';
import { IconError } from './IconError';
import { IconMinus } from './IconMinus';
import { IconPlus } from './IconPlus';
import { IconChevron } from './IconChevron';

export default {
  title: 'Icons',
  component: IconClear,
  argTypes: {
    color: { control: { type: 'color' } },
    size: { control: { type: 'number' } },
    ref: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const icons: React.FC<IPropsIcon>[] = [IconClear, IconError, IconMinus, IconPlus, IconChevron];

export const All: Story<IPropsIcon> = (props) => {
  return (
    <Box
      p={2}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}
    >
      {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
      {icons.map((Icon, index) => (
        <Stack
          isMiddled
          spacing={2}
          key={index}
          style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px' }}
        >
          <Icon {...props} />
          <div>{Icon.displayName}</div>
        </Stack>
      ))}
    </Box>
  );
};
