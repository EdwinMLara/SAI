import React from 'react';

interface CheckboxOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({
  id,
  label,
  checked,
  onChange,
  className = '',
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 cursor-pointer select-none px-2 py-1.5 rounded-full border border-main bg-card-bg transition-all shadow-sm hover:shadow-md group ${className}`}
    >
      <span className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="peer w-4 h-4 rounded-full border border-main bg-white checked:bg-primary checked:border-primary focus:outline-none focus:ring-0 focus:border-primary transition appearance-none active:scale-95 group-active:scale-95 cursor-pointer"
        />
        <svg
          className="absolute pointer-events-none w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <circle cx="12" cy="12" r="7" fill="currentColor" />
        </svg>
      </span>
      <span className="text-sm text-main font-medium select-none group-active:scale-95 transition-transform">
        {label}
      </span>
    </label>
  );
};

export default CheckboxOption;
