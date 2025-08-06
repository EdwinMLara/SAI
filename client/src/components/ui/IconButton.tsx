import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import Icon from './Icon';

interface IconButtonProps extends React.ComponentProps<typeof Button> {
  icon: string;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
  color?: string; // tailwind class, ej: 'text-gray-400'
  children?: React.ReactNode;
  title?: string; // tooltip nativo
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconPosition = 'left',
  iconClassName = '',
  color = 'text-blue-500', // por defecto primario
  children,
  title,
  ...buttonProps
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (showTooltip && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setTooltipStyle({
        left: rect.width / 2,
        top: -8,
      });
    }
  }, [showTooltip]);

  return (
    <span className="relative inline-flex">
      <Button
        {...buttonProps}
        className={buttonProps.className}
        ref={btnRef}
        onMouseEnter={(e) => {
          buttonProps.onMouseEnter?.(e);
          if (title) setShowTooltip(true);
        }}
        onMouseLeave={(e) => {
          buttonProps.onMouseLeave?.(e);
          setShowTooltip(false);
        }}
        onFocus={(e) => {
          buttonProps.onFocus?.(e);
          if (title) setShowTooltip(true);
        }}
        onBlur={(e) => {
          buttonProps.onBlur?.(e);
          setShowTooltip(false);
        }}
      >
        {iconPosition === 'left' && (
          <Icon
            name={icon}
            className={`${children ? 'mr-2' : ''} ${iconClassName} ${color}`}
            size={16}
          />
        )}
        {children}
        {iconPosition === 'right' && (
          <Icon
            name={icon}
            className={`${children ? 'ml-2' : ''} ${iconClassName} ${color}`}
            size={16}
          />
        )}
      </Button>
      {title && showTooltip && (
        <span
          className="pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 -top-8 mb-2 px-3 py-1 rounded bg-white dark:bg-gray-800 text-neutral-900 dark:text-white text-xs shadow-lg dark:shadow-2xl border border-neutral-200 dark:border-gray-600 whitespace-nowrap animate-fade-in"
          style={{ ...tooltipStyle, top: '-2.2rem' }} // más arriba
          role="tooltip"
        >
          {title}
        </span>
      )}
    </span>
  );
};

export default IconButton;
