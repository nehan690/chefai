export interface Ingredient {
  name: string;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  macros: MacroNutrients;
  matchPercentage: number; // Simulated "match" score based on ingredients
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  cuisines: string[];
  mealType: string;
}

export type LoadingState = 'idle' | 'analyzing-image' | 'generating-recipes' | 'error';
