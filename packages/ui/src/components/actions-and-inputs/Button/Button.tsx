import React from 'react';
import { CSSObject, cx } from '@emotion/css';
import { isDefined, isText } from '@body-link/type-guards';
import { makeStyles } from '../../../theme';
import { ButtonTransparent, IPropsButtonTransparent } from '../ButtonTransparent/ButtonTransparent';
import { Spinner } from '../../status-and-feedback/Spinner/Spinner';

export enum EButtonVariant {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Tertiary = 'Tertiary',
  Subtle = 'Subtle',
  DangerPrimary = 'DangerPrimary',
  DangerTertiary = 'DangerTertiary',
  DangerSubtle = 'DangerSubtle',
}

// eslint-disable-next-line @rushstack/typedef-var
const useStyles = makeStyles<EButtonVariant | 'content' | 'onlyIcon' | 'loading'>((theme) => {
  const base: CSSObject = {
    justifyContent: 'space-between',
    height: theme.spaceToCSSValue(4),
    padding: theme.spaceToCSSValue(0.5),
    transitionProperty: 'color, background',
    transitionDuration: '80ms',
  };

  const fill: CSSObject = {
    ...base,
    'color': 'var(--bl-button-color)',
    'backgroundColor': 'var(--bl-button-bg)',
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--bl-button-bg-hover)',
    },
    '&:disabled': {
      '--bl-button-dimmer': theme.colors.button.disabledDimmer,
      'color': theme.colors.button.disabled4,
      'backgroundColor': theme.colors.button.disabled1,
      '& svg': {
        color: theme.colors.button.disabled3,
      },
    },
  };

  const outline: CSSObject = {
    ...base,
    'color': 'var(--bl-button-color)',
    'backgroundColor': 'transparent',
    'boxShadow': 'inset 0 0 0 1px var(--bl-button-color)',
    '&:hover:not(:disabled)': {
      color: 'var(--bl-button-color-hover)',
      boxShadow: 'none',
      backgroundColor: 'var(--bl-button-bg-hover)',
    },
    '&:disabled': {
      '--bl-button-dimmer': theme.colors.button.disabledDimmer,
      'color': theme.colors.button.disabled3,
      'boxShadow': `inset 0 0 0 1px ${theme.colors.button.disabled1}`,
      '& svg': {
        color: theme.colors.button.disabled2,
      },
    },
  };

  const flat: CSSObject = {
    ...base,
    'color': 'var(--bl-button-color)',
    'backgroundColor': 'transparent',
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--bl-button-bg-hover)',
    },
    '&:disabled': {
      '--bl-button-dimmer': theme.colors.button.disabledDimmer,
      'color': theme.colors.button.disabled3,
      '& svg': {
        color: theme.colors.button.disabled2,
      },
    },
  };

  return {
    [EButtonVariant.Primary]: {
      ...fill,
      '--bl-button-color': theme.colors.button.primaryText,
      '--bl-button-bg': theme.colors.button.primary,
      '--bl-button-bg-hover': theme.colors.button.primaryHover,
      '--bl-button-dimmer': theme.colors.button.primaryDimmer,
    },
    [EButtonVariant.Secondary]: {
      ...fill,
      '--bl-button-color': theme.colors.button.secondaryText,
      '--bl-button-bg': theme.colors.button.secondary,
      '--bl-button-bg-hover': theme.colors.button.secondaryHover,
      '--bl-button-dimmer': theme.colors.button.secondaryDimmer,
    },
    [EButtonVariant.Tertiary]: {
      ...outline,
      '--bl-button-color': theme.colors.button.primary,
      '--bl-button-color-hover': theme.colors.button.primaryText,
      '--bl-button-bg-hover': theme.colors.button.primaryHover,
      '--bl-button-dimmer': theme.colors.button.tertiaryDimmer,
    },
    [EButtonVariant.Subtle]: {
      ...flat,
      '--bl-button-color': theme.colors.button.primary,
      '--bl-button-bg-hover': theme.colors.button.subtleHover,
      '--bl-button-dimmer': theme.colors.button.subtleDimmer,
      '&:not(:disabled) span:first-child svg': {
        color: theme.colors.button.secondary,
      },
    },
    [EButtonVariant.DangerPrimary]: {
      ...fill,
      '--bl-button-color': theme.colors.button.dangerText,
      '--bl-button-bg': theme.colors.button.danger,
      '--bl-button-bg-hover': theme.colors.button.dangerHover,
      '--bl-button-dimmer': theme.colors.button.dangerDimmer,
    },
    [EButtonVariant.DangerTertiary]: {
      ...outline,
      '--bl-button-color': theme.colors.button.danger,
      '--bl-button-color-hover': theme.colors.button.dangerText,
      '--bl-button-bg-hover': theme.colors.button.dangerHover,
      '--bl-button-dimmer': theme.colors.button.tertiaryDimmer,
    },
    [EButtonVariant.DangerSubtle]: {
      ...flat,
      '--bl-button-color': theme.colors.button.danger,
      '--bl-button-bg-hover': theme.colors.button.subtleHover,
      '--bl-button-dimmer': theme.colors.button.subtleDimmer,
    },
    content: {
      display: 'flex',
      padding: theme.spaceToCSSValue(0.5),
    },
    onlyIcon: {
      justifyContent: 'center',
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bl-button-dimmer)',
      pointerEvents: 'none',
    },
  };
});

export interface IPropsButton extends IPropsButtonTransparent {
  variant: EButtonVariant;
  children?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<IPropsButton> = React.forwardRef<HTMLButtonElement, IPropsButton>(
  ({ variant, icon, isLoading = false, className, children, ...rest }, ref) => {
    const classes = useStyles();
    const hasText = isText(children);
    const hasIcon = isDefined(icon);
    return (
      <ButtonTransparent
        {...rest}
        ref={ref}
        className={cx(classes[variant], hasIcon && !hasText && classes.onlyIcon, className)}
      >
        {hasText && <span className={classes.content}>{children}</span>}
        {hasIcon && <span className={classes.content}>{icon}</span>}
        {isLoading && (
          <div className={classes.loading}>
            <Spinner />
          </div>
        )}
      </ButtonTransparent>
    );
  }
);
