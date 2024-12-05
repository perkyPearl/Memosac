import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import LandingPage from "./LandingPage";
import Gallery from "./pages/Gallery";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import ProfilePage from "./pages/ProfilePage";
import TimeCapsule from "./pages/TimeCapsule";
import { CreateRecipe } from "./pages/CreateRecipe";
import RecipeHome from "./pages/receipeHome";
import Homepage from "./pages/Homepage";
import TimeCapsulePage from "./pages/TimeCapsulePage";
import RecipeDetail from "./pages/ReceipeDetials";
import TimeCapsuleDetail from "./pages/TimeCapsuleDetail";

function App() {
  return (
    <GoogleOAuthProvider clientId="72725116402-9951ic5ja73dj1bj77b59gaib939uevv.apps.googleusercontent.com">
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Routes without ProtectedRoute */}
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/posts" element={<IndexPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/recipes" element={<RecipeHome />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/recipes/:recipeId" element={<RecipeDetail />} />
            <Route path="/create-timecapsule" element={<TimeCapsule />} />
            <Route path="/timecapsule" element={<TimeCapsulePage />} />
            <Route path="/timecapsule/:id" element={<TimeCapsuleDetail />} />x
          </Route>
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;