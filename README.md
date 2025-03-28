# Recipe AI

A sleek, dark-themed web app that generates meal suggestions and cooking instructions based on ingredients you have at home, powered by OpenAI's ChatGPT.

## Features

- Dark, Minimalist UI: Beautiful dark-themed interface with a clean, modern design
- Ingredient Management: Add and remove ingredients you have available
- AI-Powered Suggestions: Get meal ideas that use some or all of your ingredients
- Cooking Instructions: View detailed, step-by-step instructions for making each meal
- Powered by ChatGPT: Uses OpenAI's GPT-3.5 Turbo for intelligent recipe generation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup Instructions

1. Clone this repository:
```bash
git clone <repository-url>
cd recipe-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The app will open in your default browser at `http://localhost:3000`.

## Usage

1. Add ingredients you have available by typing them in the input field and clicking "Add" or pressing Enter
2. Remove ingredients by clicking the delete icon next to them
3. Click "Generate Recipe Ideas" to get AI-powered suggestions based on your ingredients
4. View detailed cooking instructions for each suggested recipe

## Security Considerations

This app uses the OpenAI ChatGPT API, which sends your ingredient data to OpenAI's servers for processing. Ensure you comply with all relevant privacy regulations when using and distributing this app.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 