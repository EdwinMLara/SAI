import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Restricted: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      <h1 className="text-[7rem] font-extrabold text-gray-200 leading-none mb-2 select-none">
        403
      </h1>
      <p className="text-xl md:text-2xl font-semibold text-gray-500 mb-8 text-center tracking-tight">
        Acceso restringido
      </p>
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="px-8 py-3 text-base font-semibold text-gray-500 hover:text-primary"
      >
        Volver al inicio
      </Button>
    </div>
  );
};

export default Restricted;
