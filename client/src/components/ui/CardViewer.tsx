import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import IconButton from './IconButton';
import Modal from './Modal';
import InputFile from './InputFile';

interface CardViewerProps {
  url?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  extension?: 'pdf' | 'jpeg' | 'jpg' | 'png';
}

const isImage = (url: string, ext?: string) => {
  if (!url && !ext) return false;
  if (ext) return ['jpeg', 'jpg', 'png'].includes(ext);
  if (url && url.startsWith('blob:')) return true;
  return /\.(jpg|jpeg|png)$/i.test(url || '');
};
const isPDF = (url: string, ext?: string) => {
  if (!url && !ext) return false;
  if (ext) return ext === 'pdf';
  if (url && url.startsWith('blob:')) return false;
  return /\.pdf$/i.test(url || '');
};

const CardViewer: React.FC<CardViewerProps> = ({
  url,
  alt = '',
  className = '',
  style,
  extension,
}) => {
  if (!url && !extension) {
    throw new Error('CardViewer requiere al menos un url o una extension');
  }
  const [open, setOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(url || '');
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (!showActions) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.card-viewer-image')) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showActions]);

  const isAccepted =
    pendingUrl &&
    (isPDF(pendingUrl, extension) ||
      isImage(pendingUrl, extension) ||
      pendingUrl.startsWith('blob:'));
  const iconClass = 'text-gray-400 dark:text-gray-500';
  const getIcon = () => {
    if (isPDF(pendingUrl, extension))
      return <Icon name="FaRegFileAlt" size={40} className={iconClass} />;
    if (isImage(pendingUrl, extension))
      return <Icon name="FaFileInvoice" size={40} className={iconClass} />;
    return <Icon name="FaRegFile" size={40} className={iconClass} />;
  };

  if (!pendingUrl) {
    if (extension && ['jpeg', 'jpg', 'png'].includes(extension)) {
      return (
        <>
          <div
            className={`flex items-center gap-4 bg-gradient-to-br from-blue-50 via-white to-neutral-100 rounded-xl shadow-lg px-5 py-2 w-fit min-w-[180px] max-w-xs cursor-pointer hover:shadow-xl transition ${className}`}
            style={style}
            tabIndex={0}
            role="region"
            aria-label="Vista de comprobante"
            onClick={() => setShowUpload(true)}
          >
            <span className="flex items-center justify-center">
              <Icon
                name="FaFileInvoice"
                size={22}
                className="text-gray-400 dark:text-gray-500"
              />
            </span>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 select-none mr-2">
              Comprobante
            </span>
            <div className="flex">
              <IconButton
                icon="FaCloudUploadAlt"
                aria-label="Subir archivo"
                variant="ghost"
                color="text-gray-400 dark:text-gray-500"
                title="Subir imagen"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUpload(true);
                }}
              />
            </div>
          </div>
          <Modal
            open={showUpload}
            onClose={() => setShowUpload(false)}
            title="Subir comprobante"
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <InputFile
                accept="image/jpeg,image/png,image/jpg"
                onChange={(file) => {
                  if (!file) return;
                  const localUrl = URL.createObjectURL(file);
                  setPendingUrl(localUrl);
                  setShowUpload(false);
                  setOpen(true);
                }}
              />
            </div>
          </Modal>
        </>
      );
    } else if (extension && extension.toLowerCase() === 'pdf') {
      return (
        <>
          <div
            className={`relative group bg-gradient-to-br from-blue-50 via-white to-neutral-100 rounded-2xl shadow-xl flex flex-col items-stretch justify-between w-full max-w-xs min-h-[240px] transition-all duration-200 hover:shadow-2xl cursor-pointer ${className}`}
            style={{ ...style, overflow: 'hidden' }}
            tabIndex={0}
            role="region"
            aria-label="Vista de documento"
            onClick={() => setShowUpload(true)}
          >
            <div className="flex-1 flex flex-col items-center justify-center px-0 pt-7 pb-3">
              <div className="flex items-center justify-center mb-1 scale-110 drop-shadow-lg">
                <Icon
                  name="FaRegFileAlt"
                  size={40}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>
              <span className="mt-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 select-none">
                Factura
              </span>
            </div>
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 transition-opacity z-10">
              <IconButton
                icon="FaCloudUploadAlt"
                aria-label="Subir archivo"
                className="bg-white dark:bg-dark-card text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-dark-primaryLight hover:text-blue-700 dark:hover:text-blue-300 rounded-full shadow dark:shadow-lg p-2 text-lg transition border border-gray-200 dark:border-gray-700"
                title="Subir PDF"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUpload(true);
                }}
              />
            </div>
          </div>
          <Modal
            open={showUpload}
            onClose={() => setShowUpload(false)}
            title="Subir factura (PDF)"
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <InputFile
                accept="application/pdf"
                onChange={(file) => {
                  if (!file) return;
                  const localUrl = URL.createObjectURL(file);
                  setPendingUrl(localUrl);
                  setShowUpload(false);
                  setOpen(true);
                }}
              />
            </div>
          </Modal>
        </>
      );
    }
    return (
      <>
        <div
          className={`bg-card rounded-lg shadow-lg p-4 flex flex-col items-center justify-center w-full max-w-xs min-h-[180px] cursor-pointer hover:shadow-xl transition ${className}`}
          style={style}
          onClick={() => setShowUpload(true)}
          tabIndex={0}
          role="button"
          aria-label="Subir archivo"
        >
          <Icon
            name="FaCloudUploadAlt"
            size={40}
            className="mb-2 text-gray-400 dark:text-gray-500"
          />
        </div>
        <Modal
          open={showUpload}
          onClose={() => setShowUpload(false)}
          title={
            extension && extension.toLowerCase() === 'pdf'
              ? 'Subir factura (PDF)'
              : 'Subir comprobante'
          }
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <InputFile
              accept={
                extension && extension.toLowerCase() === 'pdf'
                  ? 'application/pdf'
                  : 'image/jpeg,image/png,image/jpg'
              }
              onChange={(file) => {
                if (!file) return;
                const localUrl = URL.createObjectURL(file);
                setPendingUrl(localUrl);
                setShowUpload(false);
                setOpen(true);
              }}
            />
          </div>
        </Modal>
      </>
    );
  }

  if (!isAccepted) {
    return (
      <div className="bg-card rounded-lg shadow-lg dark:shadow-xl p-4 flex flex-col items-center justify-center w-full max-w-xs min-h-[180px] border border-gray-200 dark:border-gray-700">
        <Icon name="FaRegFile" size={40} className={`mb-2 ${iconClass}`} />
        <span className="text-main text-center text-xs break-all select-none mb-2">
          Formato no soportado
        </span>
        <span className="text-main text-center text-xs break-all select-none opacity-60">
          {alt || (pendingUrl ? pendingUrl.split('/').pop() : '')}
        </span>
      </div>
    );
  }

  return (
    <>
      {isImage(pendingUrl, extension) ? (
        <div
          className={`flex items-center gap-4 bg-gradient-to-br from-blue-50 via-white to-neutral-100 rounded-xl shadow-lg px-5 py-2 w-fit min-w-[180px] max-w-xs ${className}`}
          style={style}
          tabIndex={0}
          role="region"
          aria-label="Vista de comprobante"
        >
          <span className="flex items-center justify-center">
            {React.cloneElement(getIcon(), { size: 22 })}
          </span>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 select-none mr-2">
            Comprobante
          </span>
          <div className="flex">
            <IconButton
              icon="FaCloudUploadAlt"
              aria-label="Subir archivo"
              variant="ghost"
              color="text-gray-400"
              title="Subir nueva imagen"
              onClick={() => setShowUpload(true)}
            />
            <IconButton
              icon="FaDownload"
              aria-label="Descargar archivo"
              variant="ghost"
              color="text-gray-400"
              title="Descargar imagen"
              onClick={() => {
                const link = document.createElement('a');
                link.href = pendingUrl;
                link.download = alt || pendingUrl.split('/').pop() || 'imagen';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
            <IconButton
              icon="FaEye"
              aria-label="Ver imagen"
              variant="ghost"
              color="text-gray-400"
              title="Ver imagen"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      ) : (
        <div
          className={`relative group bg-gradient-to-br from-blue-50 via-white to-neutral-100 rounded-2xl shadow-xl flex flex-col items-stretch justify-between w-full max-w-xs min-h-[240px] transition-all duration-200 hover:shadow-2xl ${className}`}
          style={{ ...style, overflow: 'hidden' }}
          tabIndex={0}
          role="region"
          aria-label="Vista de documento"
        >
          <div className="flex-1 flex flex-col items-center justify-center px-0 pt-7 pb-3">
            <div className="flex items-center justify-center mb-1 scale-110 drop-shadow-lg">
              {getIcon()}
            </div>
            <span className="mt-2 text-sm font-semibold text-neutral-500 select-none">
              {isPDF(pendingUrl, extension) ? 'Factura' : ''}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <IconButton
              icon="FaPencilAlt"
              aria-label="Editar archivo"
              className="bg-white text-blue-500 hover:bg-blue-100 hover:text-blue-700 rounded-full shadow p-2 text-lg transition"
              title="Editar archivo"
              onClick={() => setShowUpload(true)}
            />
            <IconButton
              icon="FaDownload"
              aria-label="Descargar archivo"
              className="bg-white text-blue-500 hover:bg-blue-100 hover:text-blue-700 rounded-full shadow p-2 text-lg transition"
              title="Descargar archivo"
              onClick={() => {
                const link = document.createElement('a');
                link.href = pendingUrl;
                link.download = alt || pendingUrl.split('/').pop() || 'archivo';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
            <IconButton
              icon="FaEye"
              aria-label="Ver archivo"
              className="bg-white text-blue-500 hover:bg-blue-100 hover:text-blue-700 rounded-full shadow p-2 text-lg transition"
              title="Ver archivo"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center relative"
            style={{
              maxWidth: '100vw',
              maxHeight: '100vh',
              background: 'transparent',
              boxShadow: 'none',
              borderRadius: 0,
              padding: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-6 p-2 text-3xl text-neutral-400 hover:text-neutral-600 z-10 bg-neutral-100 rounded-full shadow"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              <Icon name="FaTimes" />
            </button>
            <div className="flex flex-col items-center w-full h-full justify-center">
              {isImage(pendingUrl, extension) ||
              pendingUrl.startsWith('blob:') ? (
                <img
                  src={pendingUrl}
                  alt={alt}
                  className="w-auto h-auto max-w-[95vw] max-h-[90vh]"
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <iframe
                  src={pendingUrl}
                  title={alt || 'PDF'}
                  className="w-full h-full max-w-[95vw] max-h-[90vh]"
                  style={{ minHeight: 0, border: 'none', background: 'white' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Cargar Archivo"
        open={showUpload}
        onClose={() => setShowUpload(false)}
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          <InputFile
            accept={
              extension === 'pdf'
                ? 'application/pdf'
                : 'image/jpeg,image/png,image/jpg'
            }
            onChange={(file) => {
              if (!file) return;
              const localUrl = URL.createObjectURL(file);
              setPendingUrl(localUrl);
              setShowUpload(false);
              setOpen(true);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default CardViewer;
