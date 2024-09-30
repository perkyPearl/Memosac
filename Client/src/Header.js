import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch user profile');
        }
      })
      .then((userInfo) => {
        setUserInfo(userInfo);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setUserInfo(null);
      });
  }, [setUserInfo]);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        setUserInfo(null);
        navigate("/");
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  }

  const username = userInfo?.username;

  function handleLogoClick() {
    if (username) {
      navigate("/index");
    } else {
      navigate("/");
    }
  }

  return (
    <header className="NavBar">
      <div onClick={handleLogoClick} className="logo" style={{ cursor: "pointer" }}>
        Memosac
      </div>

      <nav>
        {username ? (
          <>
            <Link to="/create">Create new post</Link>
            <Link to="/gallery">Your Gallery</Link>
            <div
              className="dropdown"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: "pointer" }}
            >
              <>Hey, <b>{username}</b></>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <a onClick={logout} style={{ cursor: "pointer" }}>Logout</a>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
