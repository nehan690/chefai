import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Camera, Plus, X, Upload, Loader2 } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ing: string) => void;
  onRemoveIngredient: (ing: string) => void;
  onImageUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onImageUpload,
  isAnalyzing
}) => {
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddIngredient(inputValue.trim());
      setInputValue('');
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAddIngredient(inputValue.trim());
      setInputValue('');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Add an ingredient (e.g., 'Chicken', 'Spinach')"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAnalyzing}
          />
          <button
            onClick={handleAddClick}
            disabled={!inputValue.trim() || isAnalyzing}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 whitespace-nowrap"
        >
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
            <span>Scan Fridge</span>
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
        />
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fadeIn">
          {ingredients.map((ing, idx) => (
            <span
              key={`${ing}-${idx}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary font-medium rounded-full text-sm animate-popIn"
            >
              {ing}
              <button
                onClick={() => onRemoveIngredient(ing)}
                className="hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      
      {ingredients.length === 0 && !isAnalyzing && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <div className="mx-auto w-12 h-12 mb-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
             <Upload size={24} />
          </div>
          <p>Add ingredients manually or scan a photo of your fridge/pantry.</p>
        </div>
      )}
    </div>
  );
};
