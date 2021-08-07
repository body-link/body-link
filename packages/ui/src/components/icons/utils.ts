import React from 'react';
import { isDefined } from '@body-link/type-guards';
import { TSpace, useTheme } from '../../theme';

export interface IPropsIcon extends React.SVGAttributes<SVGSVGElement> {
  size?: TSpace;
  color?: string;
  rotate?: 90 | 180 | 270;
  flip?: 'vertical' | 'horizontal';
  role?: 'presentation' | 'img';
  ref?: React.Ref<SVGSVGElement>;
}

export const createIcon: (params: { viewBox: string; path: JSX.Element }) => React.FC<IPropsIcon> = (
  params
) =>
  React.memo<IPropsIcon>(
    React.forwardRef<SVGSVGElement, IPropsIcon>(
      (
        { size = 2, color = 'currentColor', display = 'block', role = 'presentation', rotate, flip, ...rest },
        ref
      ) => {
        const theme = useTheme();

        size = theme.spaceToCSSValue(size);

        const innerProps: React.SVGProps<SVGSVGElement> = {
          ...rest,
          ref,
          role,
          display,
          fill: color,
          width: size,
          height: size,
          viewBox: params.viewBox,
          children: params.path,
        };

        const transformations: string[] = isDefined(innerProps.transform) ? [innerProps.transform] : [];

        if (isDefined(rotate)) {
          transformations.unshift(`rotate(${rotate})`);
        }

        if (isDefined(flip)) {
          transformations.unshift(`scale(${flip === 'vertical' ? '-1,1' : '1,-1'})`);
        }

        if (transformations.length > 0) {
          innerProps.transform = transformations.join(' ');
        }

        return React.createElement('svg', innerProps);
      }
    )
  );
