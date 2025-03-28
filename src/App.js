import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, CircularProgress, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { generateRecipes } from './services/aiService';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F4A460', // Orange accent color from the image
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F8F8',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    }
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
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
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F4A460',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: 'none',
        },
      },
    },
  },
});

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    setError('');
    try {
      const generatedRecipes = await generateRecipes(ingredients);
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
              Enter 3 or more ingredients
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your ingredients"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIngredient();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddIngredient}
                  disabled={!newIngredient.trim()}
                  sx={{
                    minWidth: '100px',
                    height: '56px'
                  }}
                >
                  Add
                </Button>
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateRecipes}
                disabled={ingredients.length < 3 || loading}
                sx={{
                  height: 48,
                  fontSize: '1rem',
                }}
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </Box>

            {ingredients.length > 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">History</Typography>
                  <Button color="primary">See all</Button>
                </Box>
                <List>
                  {ingredients.map((ingredient, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <ListItemText primary={ingredient} />
                      </Box>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        ) : (
          <Box sx={{ my: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <IconButton onClick={() => setRecipes([])}>
                <ArrowBackIcon />
              </IconButton>
              <IconButton>
                <BookmarkBorderIcon />
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