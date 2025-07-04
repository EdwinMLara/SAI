import React, { useState } from 'react';
import { Icon } from '@components/index';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  icon,
  className = '',
  error,
  ...props
}) => {
  const isPassword = props.type === 'password';
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex flex-col gap-0.5">
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            <Icon name={icon} size="16" />
          </span>
        )}
        <input
          {...props}
          type={isPassword ? (show ? 'text' : 'password') : props.type}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 focus:border-primary'
          } text-gray-400 rounded-md bg-gray-50 focus:bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-opacity-20 ${
            error ? 'focus:ring-red-200' : 'focus:ring-blue-200'
          }${className}`}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 hover:text-gray-500 transition-all duration-200"
            onClick={() => setShow((v) => !v)}
          >
            <Icon name={show ? 'FaEyeSlash' : 'FaEye'} size={16} />
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 ml-2 mt-0.5 fort-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
