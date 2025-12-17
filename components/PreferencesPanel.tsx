import React from 'react';
import { UserPreferences } from '../types';
import { ChefHat, Leaf, Globe, Clock } from 'lucide-react';

interface PreferencesPanelProps {
  preferences: UserPreferences;
  onChange: (newPrefs: UserPreferences) => void;
}

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'Dairy-Free'];
const CUISINE_OPTIONS = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'American'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Any'];

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ preferences, onChange }) => {
  
  const toggleOption = (category: keyof UserPreferences, value: string) => {
    const current = preferences[category];
    if (Array.isArray(current)) {
      const newArray = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      onChange({ ...preferences, [category]: newArray });
    } else {
      onChange({ ...preferences, [category]: value });
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <ChefHat size={20} className="text-secondary" />
        Preferences
      </h3>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Leaf size={16} /> Dietary Restrictions
        </label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => toggleOption('dietaryRestrictions', option)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                preferences.dietaryRestrictions.includes(option)
                  ? 'bg-green-50 border-green-200 text-green-700 ring-1 ring-green-500/20'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Globe size={16} /> Preferred Cuisines
        </label>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => toggleOption('cuisines', option)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                preferences.cuisines.includes(option)
                  ? 'bg-amber-50 border-amber-200 text-amber-700 ring-1 ring-amber-500/20'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

       <div className="space-y-3">
        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Clock size={16} /> Meal Type
        </label>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map(option => (
            <button
              key={option}
              onClick={() => toggleOption('mealType', option)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                preferences.mealType === option
                  ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500/20'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
