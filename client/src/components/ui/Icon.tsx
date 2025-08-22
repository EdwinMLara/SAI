import React from 'react';

export interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = '' }) => {
  const [IconComponent, setIconComponent] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    const loadIcon = async () => {
      const icons = await import('react-icons/fa');
      const Comp = (icons as unknown as Record<string, React.ComponentType<any>>)[name];
      setIconComponent(() => Comp || null);
    };
    loadIcon();
  }, [name]);

  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};

export default Icon;
