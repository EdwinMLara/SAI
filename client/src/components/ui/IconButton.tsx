import React from 'react';
import Button from './Button';
import Icon from './Icon';

interface IconButtonProps extends React.ComponentProps<typeof Button> {
  icon: string;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
  color?: string;
  children?: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconPosition = 'left',
  iconClassName = '',
  color = 'text-primary-color',
  children,
  ...buttonProps
}) => {
  return (
    <span className="relative inline-flex">
      <Button {...buttonProps} className={buttonProps.className}>
        {iconPosition === 'left' && (
          <Icon
            name={icon}
            className={`flex-shrink-0 ${
              children ? 'mr-2' : ''
            } ${iconClassName} ${color}`}
            size={16}
          />
        )}
        {children}
        {iconPosition === 'right' && (
          <Icon
            name={icon}
            className={`flex-shrink-0 ${
              children ? 'ml-2' : ''
            } ${iconClassName} ${color}`}
            size={16}
          />
        )}
      </Button>
    </span>
  );
};

export default IconButton;
