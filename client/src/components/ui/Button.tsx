import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
   children?: React.ReactNode;
   variant?: 'primary' | 'secondary' | 'ghost';
   disabled?: boolean;
   className?: string;
}

const baseClass =
   'flex items-center justify-center rounded-md font-sans font-semibold text-base h-11 min-h-11 transition-colors';
const variantBase = {
   primary: 'bg-brand text-white',
   secondary:
      'bg-secondary text-primary-color dark:bg-background-dark-secondary',
   ghost: 'text-brand',
};
const variantHover = {
   primary: 'hover:bg-brand-600',
   secondary: 'hover-bg-secondary',
   ghost: 'hover:bg-brand-light dark:hover:bg-brand-800/10',
};
const disabledClass =
   'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500';

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
      disabled ? disabledClass : variantBase[variant],
      !disabled && variantHover[variant],
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
