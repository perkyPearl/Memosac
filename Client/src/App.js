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
import Homepage from "./pages/Homepage";
import TimeCapsulePage from "./pages/TimeCapsulePage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId="72725116402-9951ic5ja73dj1bj77b59gaib939uevv.apps.googleusercontent.com">
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/gallery" 
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/posts" 
              element={
                <ProtectedRoute>
                  <IndexPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post/:id" 
              element={
                <ProtectedRoute>
                  <PostPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-timecapsule" 
              element={
                <ProtectedRoute>
                  <TimeCapsule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/timecapsule" 
              element={
                <ProtectedRoute>
                  <TimeCapsulePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/createRecipe" 
              element={
                <ProtectedRoute>
                  <CreateRecipe />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;