import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

export interface SelectOption {
   value: string | number;
   label: string;
   disabled?: boolean;
}

interface SelectProps {
   options: SelectOption[];
   value?: string | number;
   placeholder?: string;
   disabled?: boolean;
   error?: string;
   icon?: string;
   searchable?: boolean;
   multiple?: boolean;
   className?: string;
   onChange?: (value: string | number | (string | number)[]) => void;
   onSearch?: (query: string) => void;
}

const Select: React.FC<SelectProps> = ({
   options = [],
   value,
   placeholder = 'Seleccionar opción',
   disabled = false,
   error,
   icon,
   searchable = false,
   multiple = false,
   className = '',
   onChange,
   onSearch,
}) => {
   const [isOpen, setIsOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
   });
   const [selectedValues, setSelectedValues] = useState<(string | number)[]>(
      multiple
         ? Array.isArray(value)
            ? value
            : value
              ? [value]
              : []
         : value
           ? [value]
           : []
   );

   const selectRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const filteredOptions =
      searchable && searchQuery
         ? options.filter((option) =>
              option.label.toLowerCase().includes(searchQuery.toLowerCase())
           )
         : options;

   const getDisplayValue = () => {
      if (selectedValues.length === 0) return placeholder;

      if (multiple) {
         if (selectedValues.length === 1) {
            const option = options.find(
               (opt) => opt.value === selectedValues[0]
            );
            return option?.label || '';
         }
         return `${selectedValues.length} seleccionados`;
      }

      const option = options.find((opt) => opt.value === selectedValues[0]);
      return option?.label || '';
   };

   const handleOptionClick = (optionValue: string | number) => {
      if (multiple) {
         const newValues = selectedValues.includes(optionValue)
            ? selectedValues.filter((v) => v !== optionValue)
            : [...selectedValues, optionValue];

         setSelectedValues(newValues);
         onChange?.(newValues);
      } else {
         setSelectedValues([optionValue]);
         setIsOpen(false);
         onChange?.(optionValue);
      }
   };

   const updateDropdownPosition = () => {
      if (selectRef.current) {
         const rect = selectRef.current.getBoundingClientRect();
         const spaceBelow = window.innerHeight - rect.bottom;
         const spaceAbove = rect.top;

         // Determinar si mostrar arriba o abajo
         const showAbove = spaceBelow < 240 && spaceAbove > 240;

         setDropdownPosition({
            top: showAbove ? rect.top - 8 : rect.bottom + 4,
            left: rect.left,
            width: rect.width,
         });
      }
   };

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch?.(query);
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
         setIsOpen(false);
      } else if (e.key === 'Enter' || e.key === ' ') {
         if (!isOpen) {
            setIsOpen(true);
         }
      }
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            selectRef.current &&
            !selectRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
            setSearchQuery('');
         }
      };

      const handleScroll = () => {
         if (isOpen) {
            updateDropdownPosition();
         }
      };

      const handleResize = () => {
         if (isOpen) {
            updateDropdownPosition();
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
         window.removeEventListener('scroll', handleScroll, true);
         window.removeEventListener('resize', handleResize);
      };
   }, [isOpen]);

   useEffect(() => {
      if (isOpen && searchable && inputRef.current) {
         inputRef.current.focus();
      }
      if (isOpen) {
         updateDropdownPosition();
      }
   }, [isOpen, searchable]);

   return (
      <div className="relative flex flex-col gap-1">
         <div ref={selectRef} className="relative">
            <div
               className={`
                  relative flex items-center w-full ${icon ? 'pl-10' : 'pl-4'} pr-10 py-3 
                  border rounded-md cursor-pointer
                  bg-background-tertiary dark:bg-background-dark-tertiary 
                  text-text-primary dark:text-text-dark-primary 
                  border-gray-300  
                  hover:border-brand/50 dark:hover:border-brand-dark-500/50
                  focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 
                  focus-within:bg-white dark:focus-within:bg-background-dark-primary
                  transition-all duration-200
                  ${error ? 'border-error focus-within:border-error focus-within:ring-error/20' : ''}
                  ${disabled ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-600' : ''}
                  ${isOpen ? 'border-brand ring-2 ring-brand/20 bg-white dark:bg-background-dark-primary' : ''}
                  ${className}
               `}
               onClick={() => !disabled && setIsOpen(!isOpen)}
               onKeyDown={handleKeyDown}
               tabIndex={disabled ? -1 : 0}
               role="combobox"
               aria-expanded={isOpen}
               aria-haspopup="listbox"
            >
               {icon && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark-secondary pointer-events-none font-medium z-10">
                     <Icon name={icon} size="16" />
                  </span>
               )}

               <span
                  className={`flex-1 truncate ${selectedValues.length === 0 ? 'text-text-muted dark:text-text-dark-muted' : ''}`}
               >
                  {getDisplayValue()}
               </span>

               <motion.span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark-secondary pointer-events-none"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
               >
                  <Icon name="FaChevronDown" size="14" />
               </motion.span>
            </div>
         </div>

         {/* Portal para el dropdown */}
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="fixed z-[9999]"
                  style={{
                     top: `${dropdownPosition.top}px`,
                     left: `${dropdownPosition.left}px`,
                     width: `${dropdownPosition.width}px`,
                  }}
               >
                  <div className="bg-card rounded-md shadow-strong max-h-60 overflow-hidden border border-light">
                     {searchable && (
                        <div className="p-2 border-b border-light">
                           <input
                              ref={inputRef}
                              type="text"
                              value={searchQuery}
                              onChange={handleSearchChange}
                              placeholder="Buscar..."
                              className="w-full px-3 py-2 text-sm bg-background-tertiary dark:bg-background-dark-tertiary border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                           />
                        </div>
                     )}

                     <div className="max-h-48 overflow-y-auto scrollbar-thin">
                        {filteredOptions.length === 0 ? (
                           <div className="px-4 py-3 text-sm text-text-muted dark:text-text-dark-muted">
                              {searchQuery
                                 ? 'No se encontraron resultados'
                                 : 'No hay opciones disponibles'}
                           </div>
                        ) : (
                           filteredOptions.map((option) => {
                              const isSelected = selectedValues.includes(
                                 option.value
                              );
                              return (
                                 <motion.div
                                    key={option.value}
                                    whileHover={{
                                       backgroundColor:
                                          'rgba(var(--color-brand-500), 0.05)',
                                    }}
                                    className={`
                                       flex items-center px-4 py-3 text-sm cursor-pointer transition-colors
                                       hover:bg-brand/5 dark:hover:bg-brand-dark-500/10
                                       hover:text-brand dark:hover:text-brand-dark-500
                                       ${isSelected ? 'bg-brand/10 dark:bg-brand-dark-500/20 text-brand dark:text-brand-dark-500 font-medium' : 'text-text-primary dark:text-text-dark-primary'}
                                       ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                    onClick={() =>
                                       !option.disabled &&
                                       handleOptionClick(option.value)
                                    }
                                    role="option"
                                    aria-selected={isSelected}
                                 >
                                    {multiple && (
                                       <div
                                          className={`w-4 h-4 mr-3 border rounded flex items-center justify-center ${
                                             isSelected
                                                ? 'bg-brand border-brand dark:bg-brand-dark-500 dark:border-brand-dark-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                          }`}
                                       >
                                          {isSelected && (
                                             <Icon
                                                name="FaCheck"
                                                size="10"
                                                className="text-white"
                                             />
                                          )}
                                       </div>
                                    )}

                                    <span className="flex-1 truncate">
                                       {option.label}
                                    </span>

                                    {!multiple && isSelected && (
                                       <Icon
                                          name="FaCheck"
                                          size="14"
                                          className="text-brand dark:text-brand-dark-500 ml-2"
                                       />
                                    )}
                                 </motion.div>
                              );
                           })
                        )}
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {error && (
            <span className="text-xs text-error ml-2 mt-0.5 font-medium">
               {error}
            </span>
         )}
      </div>
   );
};

export default Select;
