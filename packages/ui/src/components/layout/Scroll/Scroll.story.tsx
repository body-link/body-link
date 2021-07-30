import React from 'react';
import { Meta, Story } from '@storybook/react';
import { IPropsScroll, Scroll } from './Scroll';

export default {
  title: 'Layout/Scroll',
  component: Scroll,
  args: {
    p: 2,
    m: 6,
    hMax: 50,
    wMax: 40,
    isVertical: true,
  },
} as Meta;

export const Basic: Story<IPropsScroll> = (props) => {
  return (
    <Scroll style={{ backgroundColor: '#f0f0f0' }} {...props}>
      <h1 style={{ whiteSpace: props.isHorizontal ? 'nowrap' : undefined }}>
        Q. Is the foundational moral principle sensed only by believers?
      </h1>
      <p>Good question, let’s investigate it a bit.</p>
      <p>An answer I wrote a while ago about a similar question.</p>
      <p>I have no idea what biblical morality means.</p>
      <p>Does it mean you can own slaves as property?</p>
      <p>Does it mean genocide is acceptable if commanded by divine command?</p>
      <p>Does it mean child sacrifice is acceptable by divine command?</p>
      <p>Does it mean to love thy neighbour, especially his wife?</p>
      <p>Does it mean to kill those that don’t believe like you?</p>
      <p> Does it mean you better not think about anything else but what you think god wants?</p>
      <p> Does it mean to divide those that want to work together towards a better future?</p>
      <p> Does it mean to be compassionate towards others because that is what god wants?</p>
      <p>Does it mean to not plan for the future, god will provide?</p>
      <p>
        Does it mean that what is good or bad, as decided upon by a superstitious bronze-age community, is the
        only morality that is valid all over the universe?
      </p>
      <h2>What is atheistic morality?</h2>
      <p>
        I have even less of a clue as to what that means. Atheism is not a standpoint on morality. It is, in
        its most basic form, a lack of belief in gods.
      </p>
      <h3>Humanistic Morality</h3>
      <p>Does it mean slavery, in any form, is unacceptable?</p>
      <p>Does it mean genocide, in any form, is unacceptable?</p>
      <p>Does it mean child abuse, in any form, is unacceptable?</p>
      <p>Does it mean to support your neighbour regardless of whether he has a wife or not?</p>
      <p>Does it mean to respect those around you irrespective of what they believe or not?</p>
      <p>
        Does it mean to adjust accordingly to what society as a whole agrees on, is beneficial to work towards
        a common goal and improve the wellbeing of everyone?
      </p>
      <p>
        Does it mean think what you want, as long as you don’t act in a way to cause harm to those around you?
      </p>
      <p> Does it mean to unite society to work for a better future?</p>
      <p> Does it mean to be compassionate without the need for a reason?</p>
      <p>
        Does it mean to be looking towards the future and make plans to improve the wellbeing of future
        generations?
      </p>
    </Scroll>
  );
};
