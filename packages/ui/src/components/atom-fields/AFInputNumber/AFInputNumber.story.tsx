import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AtomField, useObservable } from '@body-link/helpers';
import { TOption } from '@body-link/type-guards';
import { AFInputNumber, IPropsAFInputNumber, IPropsAFInputNumberOptional } from './AFInputNumber';
import { Stack } from '../../layout/Stack/Stack';
import { ValueShowcase } from '../../../dev-utils/ValueShowcase';

export default {
  title: 'Atom Fields/AFInputNumber',
  component: AFInputNumber,
  argTypes: {
    field: {
      control: false,
    },
    isOptional: {
      control: false,
    },
  },
} as Meta;

const Basic: Story<IPropsAFInputNumber | IPropsAFInputNumberOptional> = (props) => {
  const state = useObservable(props.field.state$);
  return (
    <Stack p={2} spacing={4}>
      <AFInputNumber {...(props as IPropsAFInputNumberOptional)} />
      <ValueShowcase value={state} />
    </Stack>
  );
};

// eslint-disable-next-line @rushstack/typedef-var
export const Required = Basic.bind({});
Required.args = {
  field: new AtomField<number>({
    initialValue: 63,
  }),
};

// eslint-disable-next-line @rushstack/typedef-var
export const Optional = Basic.bind({});
Optional.args = {
  field: new AtomField<TOption<number>>({
    initialValue: undefined,
  }),
  isOptional: true,
  hasClearButton: true,
  placeholder: 'Enter number',
};
