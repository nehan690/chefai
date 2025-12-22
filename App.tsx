import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, AlertCircle, ArrowLeft, Key, Info } from 'lucide-react';
import { IngredientInput } from './components/IngredientInput.js';
import { PreferencesPanel } from './components/PreferencesPanel.js';
import { RecipeCard } from './components/RecipeCard.js';
import { RecipeModal } from './components/RecipeModal.js';
import { Recipe, UserPreferences, LoadingState } from './types.js';
import { generateRecipes, identifyIngredientsFromImage } from './services/gemini.js';

const INITIAL_PREFERENCES: UserPreferences = {
  dietaryRestrictions: [],
  cuisines: [],
  mealType: 'Any'
};

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'results'>('home');
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    // Robust check for API key availability
    if (!import.meta.env.VITE_API_KEY) {
  console.error("ChefAI: VITE_API_KEY is missing from environment variables.");
}
      if (!import.meta.env.VITE_API_KEY || import.meta.env.VITE_API_KEY.trim() === "") {
      setHasApiKey(false);
    }
  }, []);

  const handleAddIngredient = (name: string) => {
    if (!ingredients.includes(name)) {
      setIngredients([...ingredients, name]);
    }
  };

  const handleRemoveIngredient = (name: string) => {
    setIngredients(ingredients.filter(i => i !== name));
  };

  const handleImageUpload = async (file: File) => {
    setLoadingState('analyzing-image');
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        
        const detectedIngredients = await identifyIngredientsFromImage(base64Content);
        const newIngredients = Array.from(new Set([...ingredients, ...detectedIngredients]));
        setIngredients(newIngredients);
        setLoadingState('idle');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError("Could not identify ingredients from the image. Please try again.");
      setLoadingState('idle');
    }
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
        setError("Please add at least one ingredient.");
        return;
    }

    setLoadingState('generating-recipes');
    setError(null);
    try {
      const generatedRecipes = await generateRecipes(ingredients, preferences);
      setRecipes(generatedRecipes);
      setView('results');
    } catch (err) {
      console.error(err);
      setError("Failed to generate recipes. Please check your API key or try again later.");
    } finally {
      setLoadingState('idle');
    }
  };

  const handleReset = () => {
      setView('home');
      setRecipes([]);
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-gray-100">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Required</h1>
          <p className="text-gray-600 mb-6">
            ChefAI requires a <strong>Gemini API Key</strong> to function. 
          </p>
          <div className="bg-blue-50 p-4 rounded-xl text-left text-sm text-blue-800 mb-6 flex gap-3">
            <Info size={24} className="flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">How to fix this:</p>
              <ol className="list-decimal ml-4 space-y-1 opacity-90">
                <li>Go to Vercel/Netlify settings</li>
                <li>Add Environment Variable <strong>API_KEY</strong></li>
                <li>Paste your key from Google AI Studio</li>
                <li>Redeploy the project</li>
              </ol>
            </div>
          </div>
          <p className="text-xs text-gray-400 italic">
            Note: If you are testing locally, ensure you have a .env file with VITE_API_KEY.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <ChefHat size={20} />
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">ChefAI</span>
          </div>
          {view === 'results' && (
              <button 
                onClick={handleReset}
                className="text-sm font-medium text-gray-500 hover:text-primary flex items-center gap-1 transition-colors"
              >
                  <ArrowLeft size={16} /> Back to Search
              </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 animate-slideIn">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <p>{error}</p>
                <button onClick={() => setError(null)} className="ml-auto hover:text-red-900">✕</button>
            </div>
        )}

        {view === 'home' && (
            <div className="animate-fadeIn space-y-8">
                <div className="text-center py-8 sm:py-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        What's in your <span className="text-primary">kitchen?</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Enter ingredients you have, or scan a picture of your fridge. 
                        ChefAI will craft personalized recipes instantly.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Your Ingredients</h2>
                            <IngredientInput 
                                ingredients={ingredients}
                                onAddIngredient={handleAddIngredient}
                                onRemoveIngredient={handleRemoveIngredient}
                                onImageUpload={handleImageUpload}
                                isAnalyzing={loadingState === 'analyzing-image'}
                            />
                        </div>
                        
                         <button 
                            onClick={handleGenerateRecipes}
                            disabled={ingredients.length === 0 || loadingState !== 'idle'}
                            className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:bg-emerald-600 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {loadingState === 'generating-recipes' ? (
                                <>
                                    <Sparkles className="animate-spin" /> Chef is thinking...
                                </>
                            ) : (
                                <>
                                    <Sparkles /> Generate Recipes
                                </>
                            )}
                        </button>
                    </div>

                    <div className="md:col-span-1">
                        <PreferencesPanel 
                            preferences={preferences}
                            onChange={setPreferences}
                        />
                    </div>
                </div>
            </div>
        )}

        {view === 'results' && (
            <div className="animate-fadeIn">
                 <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recommended Recipes</h2>
                        <p className="text-gray-500 text-sm">Based on {ingredients.length} ingredients and your preferences.</p>
                    </div>
                 </div>

                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, idx) => (
                        <div 
                            key={recipe.id} 
                            className="animate-slideUp" 
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <RecipeCard 
                                recipe={recipe} 
                                onClick={() => setSelectedRecipe(recipe)}
                                index={idx}
                            />
                        </div>
                    ))}
                 </div>
                 
                 {recipes.length === 0 && (
                     <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                         <p className="text-gray-500">No recipes found. Try adjusting your ingredients.</p>
                     </div>
                 )}
            </div>
        )}

        <RecipeModal 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
        />
      </main>
      
      <footer className="mt-20 py-8 text-center text-gray-400 text-sm border-t border-gray-100">
         <p>© {new Date().getFullYear()} ChefAI. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;