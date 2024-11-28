import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../UserContext"; // Use the custom hook for context
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const { userInfo, setUserInfo } = useUser();  // Access context state and setter
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "72725116402-9951ic5ja73dj1bj77b59gaib939uevv.apps.googleusercontent.com",
      callback: handleGoogleLoginSuccess,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, []);

  const validateForm = () => {
    if (!username || !password) {
      return "Both username and password are required";
    }
    return null;
  };

  const login = async (ev) => {
    ev.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error:", errorData);
        setErrorMessage(
          errorData.message || "Login failed. Please check your credentials."
        );
        return;
      }

      const data = await response.json();
      setUserInfo(data);
      setRedirect(true);
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const user = jwtDecode(response.credential);
    if (user) {
      const generatedUsername = user.email.split("@")[0];

      try {
        const res = await fetch("http://localhost:4000/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: generatedUsername,
            email: user.email,
            profilePic: user.picture,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Login error:", errorData);
          setErrorMessage(
            errorData.message || "Login failed. Please try again."
          );
          return;
        }

        const data = await res.json();
        setUserInfo(data);
        setRedirect(true);
      } catch (error) {
        console.error("Error during Google login:", error);
        setErrorMessage(
          "An error occurred during Google login. Please try again."
        );
      }
    } else {
      setErrorMessage("Failed to log in with Google.");
    }
  };

  if (redirect) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-page">
      <form
        className="login default-form-input default-form-button"
        onSubmit={login}
      >
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <p className="error">{errorMessage}</p>
        <button type="submit">Login</button>
        <div className="center">
          <h4>Or login with Google</h4>
          <div id="signInDiv" className="google-login"></div>
        </div>
      </form>
    </div>
  );
}