import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Body Link',
    brandUrl: 'https://github.com/body-link/body-link/tree/master/packages/ui',
  }),
  panelPosition: 'right',
  enableShortcuts: false,
});
