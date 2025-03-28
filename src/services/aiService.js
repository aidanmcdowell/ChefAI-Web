import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateRecipes = async (ingredients) => {
  try {
    const prompt = `Generate 3 creative recipes using some or all of these ingredients: ${ingredients.join(', ')}. 
    For each recipe, provide:
    1. Recipe name
    2. List of all required ingredients with quantities
    3. Clear step-by-step cooking instructions

    Format each recipe like this:
    Recipe Name
    Ingredients:
    - ingredient 1
    - ingredient 2
    
    Instructions:
    1. First step
    2. Second step`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Split into individual recipes
    const recipeBlocks = text.split(/(?=Recipe \d:)/).filter(block => block.trim());
    
    // Parse each recipe block
    const recipes = recipeBlocks.map(block => {
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      // Get recipe name
      const name = lines[0].replace(/Recipe \d:\s*/, '').trim();
      
      // Find section boundaries
      const ingredientsStart = lines.findIndex(line => line.toLowerCase().includes('ingredients:'));
      const instructionsStart = lines.findIndex(line => line.toLowerCase().includes('instructions:'));
      const instructionsEnd = lines.length;
      
      // Extract and clean ingredients
      const ingredients = lines
        .slice(ingredientsStart + 1, instructionsStart)
        .filter(line => line.startsWith('-') || line.startsWith('*'))
        .map(line => line.replace(/^[-*]\s*/, '').trim());
      
      // Extract and clean instructions
      const instructions = lines
        .slice(instructionsStart + 1, instructionsEnd)
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
      
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