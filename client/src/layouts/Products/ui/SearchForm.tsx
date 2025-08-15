import React from 'react';
import { Input, Button, Icon, Checkbox } from '@ui/index.ui';

interface SearchFormProps {
  search: string;
  setSearch: (value: string) => void;
  isLoading: boolean;
  searchError: string;
  multiSearch: boolean;
  addImages: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onMultiSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  search,
  setSearch,
  isLoading,
  searchError,
  multiSearch,
  addImages,
  onSubmit,
  onMultiSearchChange,
  onShowImagesChange,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Teclea el código del producto"
            icon="FaSearch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            error={searchError}
            className="text-lg"
          />
        </div>
        <Button
          type="submit"
          disabled={!search.trim() || isLoading}
          className="px-8 py-3 h-auto"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Buscando...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Icon name="FaSearch" size={16} />
              <span>Buscar</span>
            </div>
          )}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 flex-wrap">
          <Checkbox
            id="multiSearch"
            className="text-sm"
            label="Búsqueda múltiple"
            checked={multiSearch}
            onChange={onMultiSearchChange}
          />
          <Checkbox
            id="addImages"
            className="text-sm"
            label="Mostrar imágenes"
            checked={addImages}
            onChange={onShowImagesChange}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
