import React, { useState } from 'react';
import Icon from './Icon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   icon?: string;
   error?: string;
   only?: 'number' | 'letters';
}

const Input: React.FC<InputProps> = ({
   icon,
   className = '',
   error,
   only,
   ...props
}) => {
   const isPassword = props.type === 'password';
   const [show, setShow] = useState(false);
   const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;
      let value = input.value;
      if (only === 'number') {
         value = value.replace(/[^0-9]/g, '');
         input.value = value;
      } else if (only === 'letters') {
         value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
         input.value = value;
      }
      if (props.type === 'email' || props.type === 'password') {
         if (value.includes(' ')) {
            input.value = value.replace(/\s/g, '');
         }
      }
      if (props.onInput) props.onInput(e);
   };
   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (only === 'number') {
         e.preventDefault();
         const text = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
         (e.target as HTMLInputElement).value = text;
         if (props.onChange) {
            const event = new Event('input', { bubbles: true });
            e.target.dispatchEvent(event);
         }
         return;
      } else if (only === 'letters') {
         e.preventDefault();
         const text = e.clipboardData
            .getData('text')
            .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
         (e.target as HTMLInputElement).value = text;
         if (props.onChange) {
            const event = new Event('input', { bubbles: true });
            e.target.dispatchEvent(event);
         }
         return;
      }
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
   };
   return (
      <div className="relative flex flex-col gap-1">
         <div className="relative flex items-center">
            {icon && (
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark-secondary pointer-events-none font-medium z-10">
                  <Icon name={icon} size="16" />
               </span>
            )}
            <input
               {...props}
               type={isPassword ? (show ? 'text' : 'password') : props.type}
               className={`w-full ${
                  icon ? 'pl-10' : 'pl-4'
               } pr-4 py-3 border rounded-md bg-background-tertiary dark:bg-background-dark-tertiary text-text-primary dark:text-text-dark-primary border-gray-300 dark:border-gray-600 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-white dark:focus:bg-dark-secondaryLight transition-all duration-200 outline-none ${
                  error
                     ? 'border-error focus:border-error focus:ring-error/20'
                     : ''
               } disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-400 disabled:dark:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:dark:border-gray-600 ${className}`}
               onInput={handleInput}
               onPaste={handlePaste}
            />
            {isPassword && (
               <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark-secondary z-10 hover:text-brand transition-colors duration-200"
                  onClick={() => setShow((v) => !v)}
               >
                  <Icon name={show ? 'FaEyeSlash' : 'FaEye'} size={16} />
               </button>
            )}
         </div>
         {error && (
            <span className="text-xs text-error ml-2 mt-0.5 font-medium">
               {error}
            </span>
         )}
      </div>
   );
};

export default Input;
