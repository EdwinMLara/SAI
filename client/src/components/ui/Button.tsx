import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

const baseClass =
  'flex items-center justify-center rounded-md font-sans font-semibold text-base focus:outline-none h-11 min-h-11 transition-colors duration-300';
const variantBase = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-primaryDark',
  ghost: 'text-primary',
};
const variantHover = {
  primary: 'hover:bg-primaryDark',
  secondary: 'hover:bg-secondaryDark',
  ghost: 'hover:bg-primaryLight hover:bg-opacity-80',
};
const variantFocus = {
  primary: 'focus-visible:ring-2 focus-visible:ring-primaryDark',
  secondary: 'focus-visible:ring-2 focus-visible:ring-secondaryDark',
  ghost: 'focus-visible:ring-2 focus-visible:ring-primary',
};
const disabledClass = 'bg-gray-200 text-gray-400 cursor-not-allowed';

function isIconOnly(children: React.ReactNode): boolean {
  if (React.Children.count(children) === 1) {
    const onlyChild = React.Children.toArray(children)[0];
    return (
      React.isValidElement(onlyChild) && typeof onlyChild.type !== 'string'
    );
  }
  return false;
}

function getButtonClasses({
  variant,
  disabled,
  className,
  children,
}: {
  variant: 'primary' | 'secondary' | 'ghost';
  disabled: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const iconOnly = isIconOnly(children);
  const isGhostIconOnly = iconOnly && variant === 'ghost';
  return [
    baseClass,
    iconOnly ? 'p-2 w-11 h-11' : 'px-4 py-0 h-11',
    isGhostIconOnly && 'icon-ghost-effect',
    disabled ? disabledClass : variantBase[variant],
    !disabled && variant !== 'ghost' && variantHover[variant],
    !disabled && variant === 'ghost' && 'ghost-hover-bg',
    !disabled && variantFocus[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  const classes = getButtonClasses({
    variant,
    disabled,
    className,
    children,
  });

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'tween', duration: 0.12 }}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
