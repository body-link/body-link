import React from 'react';
import { Meta, Story } from '@storybook/react';
import { IPropsText, Text } from './Text';
import { EThemeFont } from '../../../theme';
import { Box } from '../../layout/Box/Box';

export default {
  title: 'Content/Text',
  component: Text,
  argTypes: {
    color: { control: { type: 'color' } },
  },
} as Meta;

const variants: Record<EThemeFont, string> = {
  [EThemeFont.BodyLine]: 'Body line, single line text, most used',
  [EThemeFont.BodyShort]:
    "This is for short paragraphs with no more than 4 lines and is commonly used in components. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  [EThemeFont.BodyLong]:
    'This is commonly used in both the Expressive and the Productive type theme layouts for long paragraphs with more than four lines. It is a good size for comfortable, long-form reading. We also use this for longer body copy in components such as Accordion or Structured List. We always left-align this type we never center it. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere nibh nec eros mollis, id placerat nibh volutpat. Aenean ut odio tellus. Donec fringilla maximus risus. In elementum eu diam a rhoncus. Aliquam id nisl auctor, euismod metus eu, dictum est. Maecenas at turpis sagittis, imperdiet diam sit amet, blandit enim.',
  [EThemeFont.Label]: 'Label text sample',
  [EThemeFont.Caption]:
    'This is for explanatory helper text that appears below a field title within a component.',
  [EThemeFont.Heading1]: 'This is for component and layout headings',
  [EThemeFont.Heading2]: 'This is for component and layout headings',
  [EThemeFont.Code1]: '<div>Hello 407 ;-)</div>',
  [EThemeFont.Code2]: '<div>Hello 407 ;-)</div>',
};

export const AllVariants: Story<IPropsText> = (props) => {
  return (
    <Box p={5} style={{ display: 'grid', gridTemplateColumns: 'min-content 600px', gap: '40px' }}>
      {Object.entries(variants).map(([variant, sample]) => (
        <React.Fragment key={variant}>
          <Text color={props.color} variant={EThemeFont.Label}>
            {variant}
          </Text>
          <Text color={props.color} variant={variant as EThemeFont}>
            {sample}
          </Text>
        </React.Fragment>
      ))}
    </Box>
  );
};
