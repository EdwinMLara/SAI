import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ui/index.ui';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary">
      <h1 className="text-[7rem] font-extrabold text-secondary-color leading-none mb-2 select-none">
        404
      </h1>
      <p className="text-xl md:text-2xl font-semibold text-primary-color mb-8 text-center tracking-tight">
        Página no encontrada
      </p>
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="px-8 py-3 text-base font-semibold text-secondary-color hover:text-brand"
      >
        Volver al inicio
      </Button>
    </div>
  );
};

export default NotFound;
