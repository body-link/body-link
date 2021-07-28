import React from 'react';
import { Meta, Story } from '@storybook/react';
import { sortAlphabetically } from '@body-link/helpers';
import { IPropsIcon } from './utils';
import { EThemeFont } from '../../theme';
import { Box } from '../layout/Box/Box';
import { Text } from '../content/Text/Text';
import { Stack } from '../layout/Stack/Stack';
import { IconClear } from './IconClear';
import { IconError } from './IconError';
import { IconMinus } from './IconMinus';
import { IconPlus } from './IconPlus';
import { IconChevron } from './IconChevron';
import { IconRemove } from './IconRemove';
import { IconClose } from './IconClose';
import { IconEdit } from './IconEdit';
import { IconCheckbox } from './IconCheckbox';
import { IconCheckboxChecked } from './IconCheckboxChecked';
import { IconCheckboxIndeterminate } from './IconCheckboxIndeterminate';
import { IconSuccess } from './IconSuccess';

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

const icons: React.FC<IPropsIcon>[] = [
  IconSuccess,
  IconCheckbox,
  IconCheckboxChecked,
  IconCheckboxIndeterminate,
  IconEdit,
  IconClose,
  IconRemove,
  IconClear,
  IconError,
  IconMinus,
  IconPlus,
  IconChevron,
];

export const All: Story<IPropsIcon> = (props) => {
  return (
    <Box
      p={2}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}
    >
      {sortAlphabetically(
        icons,
        (c) => c.displayName ?? ''
        /* eslint-disable-next-line @typescript-eslint/naming-convention */
      ).map((Icon, index) => (
        <Stack
          isMiddled
          spacing={2}
          key={index}
          style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px', overflow: 'hidden' }}
        >
          <Icon {...props} />
          <Text variant={EThemeFont.Caption}>{Icon.displayName?.substr(4)}</Text>
        </Stack>
      ))}
    </Box>
  );
};
