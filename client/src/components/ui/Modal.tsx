import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title: string;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  component?: React.ElementType<any>;
  componentProps?: Record<string, any>;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  className = '',
  overlayClassName = '',
  closeOnOverlayClick = true,
  component: Component,
  componentProps = {},
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${overlayClassName}`}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <motion.div
          className={`bg-card rounded-lg shadow-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-lg min-h-[320px] relative ${className}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabecera */}
          {title ? (
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2
                className="flex items-center text-base sm:text-lg font-semibold text-gray-500 tracking-tight leading-tight select-none"
                style={{ letterSpacing: '.01em' }}
              >
                <span className="flex w-3 h-6 mr-1.5 items-center justify-center">
                  <svg
                    width="12"
                    height="28"
                    viewBox="0 0 12 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="5"
                      y="3"
                      width="2"
                      height="22"
                      rx="1"
                      fill="#E5E7EB"
                    />
                  </svg>
                </span>
                {title}
              </h2>
              <Button
                variant="ghost"
                className="ml-2 mt-[-0.5rem] p-1.5 text-lg"
                onClick={onClose}
                aria-label="Cerrar"
              >
                <Icon name="FaTimes" size={16} />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="absolute top-3 right-3 p-2 text-2xl"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <Icon name="FaTimes" />
            </Button>
          )}
          {/* Contenido principal */}
          <div className="modal-content-area w-full flex flex-col items-center justify-center">
            {Component ? <Component {...componentProps} /> : children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
