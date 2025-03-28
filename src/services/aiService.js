import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateRecipes = async (ingredients) => {
  try {
    const prompt = `Generate 3 creative recipes using ONLY these ingredients (no additional ingredients allowed): ${ingredients.join(', ')}. 
    Each recipe must ONLY use some combination of these ingredients and nothing else.
    
    For each recipe, provide:
    1. Recipe name (without any asterisks or special formatting)
    2. List of ingredients with quantities (using only the provided ingredients)
    3. Step-by-step cooking instructions
    
    Format each recipe exactly like this example:
    
    Simple Rice Bowl
    
    Ingredients:
    - 1 cup rice
    - 2 chicken breasts
    
    Instructions:
    1. Cook the rice
    2. Cook the chicken`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up the text first
    const cleanText = text
      .replace(/\*\*/g, '')  // Remove asterisks
      .replace(/Recipe \d+:/g, '') // Remove "Recipe N:" prefixes
      .trim();
    
    // Split into recipe blocks using double newlines
    const recipeBlocks = cleanText
      .split(/\n\n+/)
      .filter(block => block.trim())
      .reduce((recipes, block) => {
        // If this block starts with "Ingredients" or "Instructions", append it to the last recipe
        if (block.trim().toLowerCase().startsWith('ingredients') || 
            block.trim().toLowerCase().startsWith('instructions')) {
          if (recipes.length > 0) {
            recipes[recipes.length - 1] += '\n\n' + block;
          }
          return recipes;
        }
        // Otherwise, it's a new recipe
        recipes.push(block);
        return recipes;
      }, []);

    // Parse each recipe block
    const recipes = recipeBlocks.map(block => {
      const sections = block.split(/\n\n+/);
      
      // Get recipe name (first section)
      const name = sections[0].trim();
      
      // Find ingredients section
      const ingredientsSection = sections.find(s => 
        s.toLowerCase().startsWith('ingredients')
      );
      
      // Find instructions section
      const instructionsSection = sections.find(s => 
        s.toLowerCase().startsWith('instructions')
      );
      
      // Parse ingredients
      const ingredients = ingredientsSection
        ? ingredientsSection
            .split('\n')
            .slice(1) // Skip "Ingredients:" header
            .map(line => line.trim())
            .filter(line => line && (line.startsWith('-') || line.startsWith('*')))
            .map(line => line.replace(/^[-*]\s*/, '').trim())
        : [];
      
      // Parse instructions
      const instructions = instructionsSection
        ? instructionsSection
            .split('\n')
            .slice(1) // Skip "Instructions:" header
            .map(line => line.trim())
            .filter(line => line && /^\d+\./.test(line))
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
        : [];
      
      return {
        name,
        ingredients,
        instructions
      };
    });

    return recipes;
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }
}; 