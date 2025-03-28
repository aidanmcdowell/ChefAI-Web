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
    
    // Split into individual recipes and clean up formatting
    const recipeBlocks = text
      .replace(/\*\*/g, '') // Remove any asterisks
      .split(/(?=Recipe \d:|[A-Za-z]+ Rice|[A-Za-z]+ Chicken|[A-Za-z]+ Lettuce)/)
      .filter(block => block.trim());
    
    // Parse each recipe block
    const recipes = recipeBlocks.map(block => {
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      // Get recipe name (first non-empty line)
      const name = lines[0].replace(/Recipe \d:\s*/, '').trim();
      
      // Find section boundaries
      const ingredientsStart = lines.findIndex(line => 
        line.toLowerCase().includes('ingredients:') || 
        line.toLowerCase() === 'ingredients'
      );
      const instructionsStart = lines.findIndex(line => 
        line.toLowerCase().includes('instructions:') || 
        line.toLowerCase() === 'instructions'
      );
      
      // Extract and clean ingredients
      const ingredients = lines
        .slice(ingredientsStart + 1, instructionsStart)
        .filter(line => line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))
        .map(line => line.replace(/^[-*\d.]\s*/, '').trim())
        .filter(line => line && !line.toLowerCase().includes('ingredients') && !line.toLowerCase().includes('instructions'));
      
      // Extract and clean instructions
      const instructions = lines
        .slice(instructionsStart + 1)
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line);
      
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