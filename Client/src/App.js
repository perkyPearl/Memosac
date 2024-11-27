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
import ProfilePage from "./pages/ProfilePage"
import TimeCapsule from "./pages/TimeCapsule";

function App() {
  return (
    <GoogleOAuthProvider clientId="72725116402-9951ic5ja73dj1bj77b59gaib939uevv.apps.googleusercontent.com">
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/home" element={<IndexPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/profile" element={<ProfilePage/>}></Route>
            <Route path="/timecapsule" element={<TimeCapsule/>}></Route>
          </Route>
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
