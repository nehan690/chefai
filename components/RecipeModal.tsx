import React, { useEffect, useState } from 'react';
import { Recipe } from '../types';
import { X, Clock, Flame, Users, ChefHat } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (recipe) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsOpen(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [recipe]);

  if (!recipe) return null;

  const macroData = [
    { name: 'Protein', value: recipe.macros.protein, color: '#10B981' }, // Emerald
    { name: 'Carbs', value: recipe.macros.carbs, color: '#F59E0B' },    // Amber
    { name: 'Fat', value: recipe.macros.fat, color: '#6366F1' },        // Indigo
  ];

  const imageId = (recipe.title.length * 13) % 80;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className={`relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Close Button Mobile */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full md:hidden"
        >
            <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/5 h-48 md:h-auto relative">
          <img 
            src={`https://picsum.photos/id/${imageId + 100}/800/1200`} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10"></div>
          <div className="absolute bottom-4 left-4 text-white md:hidden">
            <h2 className="text-2xl font-bold">{recipe.title}</h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-3/5 overflow-y-auto p-6 md:p-8">
            <div className="hidden md:flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800 leading-tight">{recipe.title}</h2>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{recipe.description}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-3 bg-orange-50 rounded-xl flex flex-col items-center justify-center text-center">
                    <Clock size={20} className="text-orange-500 mb-1" />
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Time</span>
                    <span className="font-bold text-gray-800">{recipe.cookTime}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl flex flex-col items-center justify-center text-center">
                    <Flame size={20} className="text-emerald-500 mb-1" />
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Calories</span>
                    <span className="font-bold text-gray-800">{recipe.macros.calories}</span>
                </div>
                 <div className="p-3 bg-indigo-50 rounded-xl flex flex-col items-center justify-center text-center">
                    <ChefHat size={20} className="text-indigo-500 mb-1" />
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Difficulty</span>
                    <span className="font-bold text-gray-800">{recipe.difficulty}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        Ingredients
                    </h3>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                                {ing}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Macros Chart */}
                <div className="bg-gray-50 rounded-2xl p-4">
                     <h3 className="text-sm font-bold text-gray-700 mb-2 text-center">Nutritional Breakdown</h3>
                     <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={macroData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={55}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {macroData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="flex justify-center gap-4 text-xs font-medium text-gray-500 mt-[-10px]">
                        <span>{recipe.macros.protein}g Protein</span>
                        <span>{recipe.macros.carbs}g Carbs</span>
                        <span>{recipe.macros.fat}g Fat</span>
                     </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Instructions</h3>
                <ol className="space-y-4">
                    {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-sm">
                                {idx + 1}
                            </span>
                            <p className="text-gray-700 text-sm leading-relaxed pt-1.5">{step}</p>
                        </li>
                    ))}
                </ol>
            </div>

        </div>
      </div>
    </div>
  );
};
