import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box } from '../Box/Box';
import { Stack, IPropsStack } from './Stack';

export default {
  title: 'Layout/Stack',
  component: Stack,
} as Meta;

export const Basic: Story<IPropsStack> = () => {
  return (
    <Stack p={2} spacing={5}>
      <Stack spacing={1}>
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          spacing 1
        </Box>
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          spacing 1
        </Box>
        <Box w={2} h={2} style={{ backgroundColor: 'coral' }} />
      </Stack>
      <Stack isCentered spacing={1}>
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          isCentered
        </Box>
        <Box w={2} h={2} style={{ backgroundColor: 'coral' }} />
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          spacing 1
        </Box>
      </Stack>
      <Stack isInline spacing={1}>
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          isInline
        </Box>
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          spacing 1
        </Box>
        <Box w={2} h={2} style={{ backgroundColor: 'coral' }} />
      </Stack>
      <Stack isInline isCentered spacing={1}>
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          isInline
        </Box>
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          spacing 1
        </Box>
        <Box w={2} h={2} style={{ backgroundColor: 'coral' }} />
        <Box p={1} style={{ backgroundColor: 'coral' }}>
          isCentered
        </Box>
      </Stack>
      <Stack isMiddled w={20} h={20} style={{ backgroundColor: 'coral' }}>
        <Box p={1} style={{ backgroundColor: 'white' }}>
          isMiddled
        </Box>
      </Stack>
    </Stack>
  );
};
