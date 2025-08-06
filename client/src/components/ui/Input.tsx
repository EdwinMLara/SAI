import React, { useState } from 'react';
import Icon from './Icon';

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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
            <Icon name={icon} size="16" />
          </span>
        )}
        <input
          {...props}
          type={isPassword ? (show ? 'text' : 'password') : props.type}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${
            error
              ? 'border-red-400 focus:border-red-500 dark:border-red-500 dark:focus:border-red-400'
              : 'border-gray-300 focus:border-primary dark:border-gray-600 dark:focus:border-dark-primary'
          } text-gray-900 dark:text-dark-textMain rounded-md bg-gray-50 dark:bg-dark-card focus:bg-white dark:focus:bg-dark-secondaryLight transition-all duration-200 outline-none focus:ring-2 focus:ring-opacity-20 ${
            error
              ? 'focus:ring-red-200 dark:focus:ring-red-500/20'
              : 'focus:ring-blue-200 dark:focus:ring-blue-500/20'
          } ${className}`}
          onInput={(e) => {
            if (props.type === 'email' || props.type === 'password') {
              const input = e.target as HTMLInputElement;
              const value = input.value;
              if (value.includes(' ')) {
                input.value = value.replace(/\s/g, '');
              }
            }
            if (props.onInput) props.onInput(e);
          }}
          onPaste={(e) => {
            if (props.type === 'email' || props.type === 'password') {
              e.preventDefault();
              const text = e.clipboardData.getData('text').replace(/\s/g, '');
              (e.target as HTMLInputElement).value = text;
              if (props.onChange) {
                const event = new Event('input', { bubbles: true });
                e.target.dispatchEvent(event);
              }
            } else {
              if (props.onPaste) props.onPaste(e);
            }
          }}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 hover:text-gray-500 dark:hover:text-gray-400 transition-all duration-200"
            onClick={() => setShow((v) => !v)}
          >
            <Icon name={show ? 'FaEyeSlash' : 'FaEye'} size={16} />
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 dark:text-red-400 ml-2 mt-0.5 fort-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
