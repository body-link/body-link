import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, IPropsButton, EButtonVariant } from './Button';
import { Stack } from '../../../../lib';
import { IconPlus } from '../../icons/IconPlus';

export default {
  title: 'Actions & Inputs/Button',
  component: Button,
  argTypes: {
    variant: { control: false },
    icon: { control: false },
    isFit: { control: false },
    isDisabled: { control: false },
    ref: { control: false },
  },
} as Meta;

const Basic: Story<IPropsButton> = (props) => {
  return (
    <Stack spacing={4} p={4}>
      <Stack isInline spacing={4}>
        <Button {...props} isFit>
          Button isFit
        </Button>
        <Button {...props} isFit icon={<IconPlus />}>
          With icon
        </Button>
        <Button {...props} isFit icon={<IconPlus />} />
      </Stack>
      <Stack isInline spacing={4}>
        <Button {...props}>Button</Button>
        <Button {...props} icon={<IconPlus />}>
          With icon
        </Button>
        <Button {...props} icon={<IconPlus />} />
      </Stack>
      <Stack isInline spacing={4}>
        <Button {...props} isDisabled>
          Button isDisabled
        </Button>
        <Button {...props} isDisabled icon={<IconPlus />}>
          With icon
        </Button>
        <Button {...props} isDisabled icon={<IconPlus />} />
      </Stack>
      <Stack isInline spacing={4}>
        <Button {...props} isLoading icon={<IconPlus />}>
          Button isLoading
        </Button>
        <Button {...props} isLoading isDisabled icon={<IconPlus />}>
          Button isLoading isDisabled
        </Button>
      </Stack>
    </Stack>
  );
};

// eslint-disable-next-line @rushstack/typedef-var
export const Primary = Basic.bind({});
Primary.args = {
  variant: EButtonVariant.Primary,
};

// eslint-disable-next-line @rushstack/typedef-var
export const Secondary = Basic.bind({});
Secondary.args = {
  variant: EButtonVariant.Secondary,
};

// eslint-disable-next-line @rushstack/typedef-var
export const Tertiary = Basic.bind({});
Tertiary.args = {
  variant: EButtonVariant.Tertiary,
};

// eslint-disable-next-line @rushstack/typedef-var
export const Subtle = Basic.bind({});
Subtle.args = {
  variant: EButtonVariant.Subtle,
};

// eslint-disable-next-line @rushstack/typedef-var
export const DangerPrimary = Basic.bind({});
DangerPrimary.args = {
  variant: EButtonVariant.DangerPrimary,
};

// eslint-disable-next-line @rushstack/typedef-var
export const DangerTertiary = Basic.bind({});
DangerTertiary.args = {
  variant: EButtonVariant.DangerTertiary,
};

// eslint-disable-next-line @rushstack/typedef-var
export const DangerSubtle = Basic.bind({});
DangerSubtle.args = {
  variant: EButtonVariant.DangerSubtle,
};
