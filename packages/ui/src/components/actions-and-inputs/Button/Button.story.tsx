import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, EButtonVariant, IPropsButton } from './Button';
import { IconPlus } from '../../icons/IconPlus';
import { Box } from '../../layout/Box/Box';
import { Text } from '../../content/Text/Text';
import { Stack } from '../../layout/Stack/Stack';
import { EThemeFont } from '../../../theme';

export default {
  title: 'Actions & Inputs/Button',
  component: Button,
  argTypes: {
    variant: { control: false },
    icon: { control: false },
    isFit: { control: false },
    isDisabled: { control: false },
    isLoading: { control: false },
    alignSelf: { control: false },
    flex: { control: false },
    w: { control: false },
    wMax: { control: false },
    wMin: { control: false },
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
      <Box wMax={58}>
        <Text variant={EThemeFont.BodyShort}>
          {props.variant === EButtonVariant.Primary
            ? 'For the principal call to action on the page. Primary buttons should only appear once per screen (not including the application header, modal dialog, or side panel).'
            : props.variant === EButtonVariant.Secondary
            ? 'For secondary actions on each page. Secondary buttons can only be used in conjunction with a primary button. As part of a pair, the secondary button’s function is to perform the negative action of the set, such as “Cancel” or “Back”. Do not use a secondary button in isolation and do not use a secondary button for a positive action.'
            : props.variant === EButtonVariant.Tertiary
            ? 'For less prominent, and sometimes independent, actions. Tertiary buttons can be used in isolation or paired with a primary button when there are multiple calls to action. Tertiary buttons can also be used for sub-tasks on a page where a primary button for the main and final action is present.'
            : props.variant === EButtonVariant.Subtle
            ? 'For the least pronounced actions; often used in conjunction with a primary button. In a situation such as a progress flow, a subtle button may be paired with a primary and secondary button set, where the primary button is for forward action, the secondary button is for “Back”, and the subtle button is for “Cancel”.'
            : 'For actions that could have destructive effects on the user’s data (for example, delete or remove). Danger button has three styles: primary, tertiary, and subtle.'}
        </Text>
      </Box>
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
