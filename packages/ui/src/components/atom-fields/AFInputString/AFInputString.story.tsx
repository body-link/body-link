import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AtomField, useObservable } from '@body-link/helpers';
import { TOption } from '@body-link/type-guards';
import { AFInputString, IPropsAFInputString, IPropsAFInputStringOptional } from './AFInputString';
import { Stack } from '../../layout/Stack/Stack';
import { ValueShowcase } from '../../../dev-utils/ValueShowcase';

export default {
  title: 'Atom Fields/AFInputString',
  component: AFInputString,
  argTypes: {
    field: {
      control: false,
    },
    isOptional: {
      control: false,
    },
  },
} as Meta;

const Basic: Story<IPropsAFInputString | IPropsAFInputStringOptional> = (props) => {
  const state = useObservable(props.field.state$);
  return (
    <Stack p={2} spacing={4}>
      <AFInputString {...(props as IPropsAFInputStringOptional)} />
      <ValueShowcase value={state} />
    </Stack>
  );
};

// eslint-disable-next-line @rushstack/typedef-var
export const Required = Basic.bind({});
Required.args = {
  field: new AtomField<string>({
    initialValue: 'Initial value',
  }),
};

// eslint-disable-next-line @rushstack/typedef-var
export const Optional = Basic.bind({});
Optional.args = {
  field: new AtomField<TOption<string>>({
    initialValue: undefined,
  }),
  isOptional: true,
  hasClearButton: true,
};
