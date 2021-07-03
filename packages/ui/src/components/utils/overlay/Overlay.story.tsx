import React from 'react';
import { Meta, Story } from '@storybook/react';
import { useRefFn } from '@body-link/helpers';
import { Stack } from '../../layout/Stack/Stack';
import { IOverlayOptions } from './types';
import { Overlay } from './Overlay';
import { OverlayArrow } from './OverlayArrow';
import { EThemeColorSetName } from '../../../theme';

export default {
  title: 'Utils/Overlay',
  argTypes: {
    placement: {
      control: {
        type: 'select',
      },
      options: [
        'auto',
        'auto-start',
        'auto-end',
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'right-start',
        'right-end',
        'left-start',
        'left-end',
      ],
    },
  },
  args: {
    content: 'Hello!',
    closeOnEsc: true,
    closeOnScroll: true,
    closeOnOutsideClick: true,
    closeOnInnerClick: true,
    placement: 'auto',
    offset: [0, 8],
    hasArrow: true,
  },
} as Meta;

interface IProps extends IOverlayOptions {
  content: string;
}

export const Basic: Story<IProps> = ({
  content,
  closeOnEsc,
  closeOnScroll,
  closeOnInnerClick,
  closeOnOutsideClick,
  hasArrow,
  placement,
  offset,
}) => {
  const refDock = React.useRef<HTMLDivElement>(null);

  const { current: overlay } = useRefFn(
    () =>
      new Overlay({
        closeOnEsc: false,
        closeOnScroll: false,
        closeOnOutsideClick: false,
        closeOnInnerClick: false,
        offset: 0,
        hasArrow: false,
        placement: 'auto',
      })
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
          {hasArrow && (
            <OverlayArrow size={16} colorSetName={EThemeColorSetName.White} ref={overlay.refArrow} />
          )}
        </div>
      ),
      refDock,
      options: {
        closeOnEsc,
        closeOnScroll,
        closeOnInnerClick,
        closeOnOutsideClick,
        offset,
        hasArrow,
        placement,
      },
    });

  const toggle = (): void => {
    if (overlay.isOpen) {
      overlay.close();
    } else {
      open();
    }
  };

  React.useEffect(() => overlay.destroy, []);

  return (
    <Stack spacing={10} isCentered>
      <Stack isInline spacing={2} p={2}>
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <button onClick={open}>Open</button>
        <button onClick={overlay.close}>Close</button>
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <button onClick={toggle}>Toggle</button>
      </Stack>
      <div ref={refDock} style={{ padding: 16, backgroundColor: 'limegreen' }}>
        Dock
      </div>
    </Stack>
  );
};
