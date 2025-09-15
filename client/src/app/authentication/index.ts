import Authentication from './pages/Authentication';
import RegisterForm from './ui/RegisterForm';
import LoginForm from './ui/LoginForm';
export * from './common/containerVariants';
import useLogin from './hooks/useLogin';
import useRegister from './hooks/useRegister';
import Restricted from './pages/Restricted';

export {
   Authentication,
   RegisterForm,
   LoginForm,
   useLogin,
   useRegister,
   Restricted,
};
