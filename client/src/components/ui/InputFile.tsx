import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

interface InputFileProps {
  onChange?: (file: File | null) => void;
  accept: string;
  className?: string;
  error?: string;
  helperText?: string;
  multiple?: boolean;
  disabled?: boolean;
  onContinue?: () => void;
}

const InputFile: React.FC<InputFileProps> = ({
  onChange,
  accept,
  className = '',
  error,
  helperText,
  multiple = false,
  disabled = false,
  onContinue,
}) => {
  if (!accept) throw new Error('El prop "accept" es obligatorio en InputFile.');
  if (!onContinue)
    throw new Error(
      'El prop "onContinue" es obligatorio en InputFile para el botón.'
    );
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [invalidFile, setInvalidFile] = useState(false);

  const isValidFileType = (file: File) => {
    if (!accept) return true;
    const acceptList = accept.split(',').map((a) => a.trim().toLowerCase());
    return acceptList.some((type) => {
      if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
      if (type.includes('/')) return file.type === type;
      return false;
    });
  };

  const handleFile = (fileList: FileList | null) => {
    setInvalidFile(false);
    if (fileList && fileList.length > 0) {
      const files = Array.from(fileList);
      const validFiles = files.filter(isValidFileType);
      if (validFiles.length === 0) {
        setFileNames([]);
        setInvalidFile(true);
        onChange?.(null);
        return;
      }
      setFileNames(validFiles.map((f) => f.name));
      setInvalidFile(false);
      onChange?.(multiple ? (validFiles as any) : validFiles[0]);
    } else {
      setFileNames([]);
      setInvalidFile(false);
      onChange?.(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files);
  };

  const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  return (
    <div className={`w-full max-w-xs md:max-w-md ${className}`}>
      <motion.label
        initial={{ scale: 1 }}
        animate={{ scale: dragActive ? 1.03 : 1 }}
        whileHover={{ scale: 1.04 }}
        className={`flex flex-col items-center justify-center w-full h-32 px-4 transition-all border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-dark-secondary/50 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-dark-primary/40 ${
          dragActive
            ? 'border-primary bg-primary/10 dark:bg-dark-primary/10'
            : ''
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        htmlFor="input-file"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        tabIndex={0}
        aria-disabled={disabled}
      >
        <span className="text-xs text-gray-600 dark:text-gray-400 text-center select-none flex flex-col items-center w-full">
          <span className="mb-4">
            <svg
              className="w-8 h-8 text-primary dark:text-dark-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16v-8m0 0-3.5 3.5M12 8l3.5 3.5M4 16.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5"
              />
            </svg>
          </span>
          <span className="flex items-center justify-center gap-2 w-full text-center">
            {fileNames.length > 0 && !invalidFile ? (
              <span className="font-medium break-all w-full text-center text-gray-700 dark:text-gray-300">
                {multiple
                  ? `${fileNames.length} archivo${
                      fileNames.length > 1 ? 's' : ''
                    } seleccionado${fileNames.length > 1 ? 's' : ''}: `
                  : 'Archivo seleccionado: '}
                <span className="text-primary dark:text-dark-primary font-semibold">
                  {multiple ? fileNames.join(', ') : fileNames[0]}
                </span>
              </span>
            ) : invalidFile ? (
              <span className="flex flex-col items-center w-full">
                <span className="text-red-500 dark:text-red-400 font-semibold break-all w-full text-center">
                  Tipo de archivo no permitido. Selecciona uno válido.
                </span>
              </span>
            ) : (
              <span className="w-full text-center">
                {multiple
                  ? 'Arrastra o haz clic para seleccionar archivos'
                  : 'Arrastra o haz clic para seleccionar un archivo'}
              </span>
            )}
          </span>
        </span>
        <input
          ref={inputRef}
          id="input-file"
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
          multiple={multiple}
          disabled={disabled}
        />
      </motion.label>
      <div className="flex justify-center mt-2">
        <Button
          type="button"
          variant="primary"
          onClick={onContinue}
          disabled={disabled || fileNames.length === 0}
          className="w-full text-xs py-1.5"
        >
          Continuar
        </Button>
      </div>
      {helperText && !error && (
        <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </span>
      )}
      {error && (
        <span className="block mt-1 text-xs text-red-500 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputFile;
