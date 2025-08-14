import logoLight from '@/assets/logo_ligthmode.png';
import logoDark from '@/assets/logo_darkmode.png';
import { useTheme } from '@/context/Theme.context';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  const { theme } = useTheme();
  return (
    <a href="/">
      <img
        src={theme === 'dark' ? logoDark : logoLight}
        alt="Logo INSOEL"
        className={className}
        draggable={false}
      />
    </a>
  );
};
