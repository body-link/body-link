import React from 'react';
import { Meta, Story } from '@storybook/react';
import { useRefFn } from '@body-link/helpers';
import { OverlayStatic } from './OverlayStatic';
import { Stack } from '../../layout/Stack/Stack';
import { IOverlayStaticOptions } from './types';

export default {
  title: 'Utils/OverlayStatic',
  args: {
    content: 'Hello!',
    closeOnEsc: true,
    closeOnScroll: true,
    closeOnOutsideClick: true,
    closeOnInnerClick: true,
  },
} as Meta;

interface IProps extends IOverlayStaticOptions {
  content: string;
}

export const Basic: Story<IProps> = ({
  content,
  closeOnEsc,
  closeOnScroll,
  closeOnInnerClick,
  closeOnOutsideClick,
}) => {
  const { current: overlay } = useRefFn(
    () =>
      new OverlayStatic({
        closeOnEsc: false,
        closeOnScroll: false,
        closeOnOutsideClick: false,
        closeOnInnerClick: false,
      } as IOverlayStaticOptions)
  );

  const open = (): void =>
    overlay.open({
      element: (
        <div
          ref={overlay.refContainer}
          style={{ position: 'absolute', top: '30%', left: '30%', padding: '24px', border: '1px solid' }}
        >
          <Stack isInline spacing={1}>
            <div>Content</div>
            <div>{content}</div>
          </Stack>
          <Stack isInline spacing={1}>
            <div>Date.now()</div>
            <div>{Date.now()}</div>
          </Stack>
        </div>
      ),
      options: {
        closeOnEsc,
        closeOnScroll,
        closeOnInnerClick,
        closeOnOutsideClick,
      },
    });

  React.useEffect(() => overlay.destroy, []);

  return (
    <Stack isInline spacing={2} p={2}>
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <button onClick={open}>Open</button>
      <button onClick={overlay.close}>Close</button>
    </Stack>
  );
};
