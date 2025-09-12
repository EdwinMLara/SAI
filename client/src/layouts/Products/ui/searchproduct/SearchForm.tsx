import React from 'react';
import { Input, Button, Icon, Checkbox, Message } from '@ui/index';

interface SearchFormProps {
  search: string;
  setSearch: (value: string) => void;
  isLoading: boolean;
  searchError: string;
  addImages: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onShowImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  search,
  setSearch,
  isLoading,
  searchError,
  addImages,
  onSubmit,
  onShowImagesChange,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ingresa el código del producto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-lg h-14"
            />
          </div>
          {searchError && (
            <div className="flex items-center gap-2 mt-2 text-red-600">
              <Icon name="FaExclamationTriangle" size={14} />
              <span className="text-sm">{searchError}</span>
            </div>
          )}
        </div>

        <div className="flex">
          <Button
            type="submit"
            disabled={!search.trim() || isLoading}
            className="w-full h-14"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin"></div>
                <span>Buscando</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Icon name="FaSearch" size={18} />
                <span>Buscar</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-tertiary rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-semibold text-primary-color">
            Opciones de Búsqueda
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center gap-4 p-4 bg-card hover:border-brand transition-colors duration-200">
            <input
              type="checkbox"
              id="addImages"
              checked={addImages}
              onChange={onShowImagesChange}
              className="form-checkbox h-5 w-5 text-brand focus:ring-brand border-gray-300 rounded transition duration-150"
            />
            <div className="flex-1">
              <label
                htmlFor="addImages"
                className="flex items-center cursor-pointer"
              >
                <span className="font-medium text-primary-color">
                  Mostrar imágenes
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
