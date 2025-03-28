import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { generateRecipes } from './services/aiService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F4A460',
    }
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: '0.875rem',
      color: '#666666',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 25,
            backgroundColor: '#F0F0F0',
            '& fieldset': {
              borderColor: 'transparent',
            }
          },
        },
      },
    }
  },
});

function App() {
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateRecipes = async () => {
    const ingredientsList = newIngredient.split(',').map(i => i.trim()).filter(i => i.length > 0);
    if (ingredientsList.length < 3) return;
    
    setLoading(true);
    setError('');
    try {
      const generatedRecipes = await generateRecipes(ingredientsList);
      setRecipes(generatedRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ px: 2 }}>
        {recipes.length === 0 ? (
          <Box sx={{ my: 4 }}>
            <Typography variant="h1" gutterBottom align="left" sx={{ mb: 4 }}>
              What can we make?
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
              Enter 3 or more ingredients, separated by commas
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Example: chicken, lettuce, rice"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateRecipes}
                disabled={newIngredient.split(',').filter(i => i.trim().length > 0).length < 3 || loading}
                sx={{ height: 48, fontSize: '1rem' }}
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ my: 4 }}>
            <Box sx={{ mb: 4 }}>
              <IconButton onClick={() => setRecipes([])}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
            
            {recipes.map((recipe, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h1" gutterBottom>
                  {recipe.name}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Ingredients needed:
                  </Typography>
                  <List dense>
                    {recipe.ingredients.map((ingredient, i) => (
                      <ListItem key={i} sx={{ py: 0.5 }}>
                        <ListItemText primary={ingredient} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Instructions:
                  </Typography>
                  <List>
                    {recipe.instructions.map((instruction, i) => (
                      <ListItem key={i} sx={{ py: 1 }}>
                        <ListItemText primary={`${i + 1}. ${instruction}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App; 