import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserPreferences } from "../types";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RECIPE_MODEL = "gemini-2.5-flash";

/**
 * Identifies ingredients from a base64 encoded image string.
 */
export const identifyIngredientsFromImage = async (base64Image: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: RECIPE_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, can be dynamic if needed
              data: base64Image
            }
          },
          {
            text: "Identify all the food ingredients visible in this image. Return ONLY a simple JSON list of strings, e.g., [\"apple\", \"milk\"]. Do not include quantities or adjectives unless necessary (e.g., 'ground beef')."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error identifying ingredients:", error);
    throw new Error("Failed to identify ingredients from image.");
  }
};

/**
 * Generates recipe suggestions based on ingredients and preferences.
 */
export const generateRecipes = async (
  ingredients: string[],
  preferences: UserPreferences
): Promise<Recipe[]> => {
  try {
    const prompt = `
      You are a world-class chef and nutritionist.
      
      User Ingredients: ${ingredients.join(", ")}.
      Dietary Restrictions: ${preferences.dietaryRestrictions.join(", ") || "None"}.
      Preferred Cuisines: ${preferences.cuisines.join(", ") || "Any"}.
      Meal Type: ${preferences.mealType || "Any"}.

      Task: Suggest 3 creative and distinct recipes that use the provided ingredients. 
      It is okay to assume the user has basic pantry staples like salt, pepper, oil, flour, sugar, and water.
      
      For each recipe, estimate the nutritional values (macros).
      Calculate a 'matchPercentage' based on how many of the User Ingredients are used vs how many extra are needed (excluding pantry staples).
    `;

    const response = await ai.models.generateContent({
      model: RECIPE_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              instructions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              prepTime: { type: Type.STRING },
              cookTime: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              cuisine: { type: Type.STRING },
              matchPercentage: { type: Type.INTEGER },
              macros: {
                type: Type.OBJECT,
                properties: {
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                  calories: { type: Type.NUMBER },
                },
                required: ["protein", "carbs", "fat", "calories"]
              }
            },
            required: ["id", "title", "description", "ingredients", "instructions", "prepTime", "cookTime", "difficulty", "cuisine", "macros", "matchPercentage"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes. Please try again.");
  }
};
