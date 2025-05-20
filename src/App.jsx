import { Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalProvider } from './providers/ModalProvider'; // Adjust the path as necessary
import Layout from './Layout';
import Home from './pages/Home';
import { RecipesByTagView } from './pages/RecipesByTag/recipesByTag/view';
import { RecipesView } from './pages/Recipes/recipes/view';
import { RecipeView } from './pages/Recipe/view';
import { UserProfileView } from './pages/UserProfile/view';
import { AuthProvider } from './providers/AuthProvider';
import ModalManager from './components/ModalManager';
import FavoriteRecipesView from './pages/favorites/view';
import AdminPage from './pages/Admin';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <ModalManager />
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/recipes" element={<RecipesView />} />
              <Route path="/recipe/:documentId" element={<RecipeView />} />
              <Route path="/recipeTag/:tagName" element={<RecipesByTagView />} />
              <Route path="/me" element={<UserProfileView />} />
              <Route path="/myFavorites" element={<FavoriteRecipesView />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Layout>
        </ModalProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
