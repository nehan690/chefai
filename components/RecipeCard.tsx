import React from 'react';
import { Recipe } from '../types';
import { Clock, Flame, BarChart2, ArrowRight } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  index: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, index }) => {
  // Generate a consistent random image based on the recipe title length or id to keep it static-ish for the demo
  const imageId = (recipe.title.length * 13 + index * 7) % 80;
  
  return (
    <div 
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
        onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
            src={`https://picsum.photos/id/${imageId + 100}/800/600`} 
            alt={recipe.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
             <BarChart2 size={12} className="text-primary" />
             {recipe.matchPercentage}% Match
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium text-white shadow-sm">
             {recipe.cuisine}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
             <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">{recipe.title}</h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="mt-auto flex items-center justify-between text-xs font-medium text-gray-500">
             <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {recipe.cookTime}
                 </span>
                 <span className={`flex items-center gap-1.5 ${
                     recipe.difficulty === 'Easy' ? 'text-green-600' :
                     recipe.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                 }`}>
                    <Flame size={14} />
                    {recipe.difficulty}
                 </span>
             </div>
             <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                <ArrowRight size={18} />
             </button>
        </div>
      </div>
    </div>
  );
};
