import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Verify token and get user data
      axios
        .get("http://localhost:5050/verify", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  return (
    <div>
      <h2>Homepage</h2>
      {token ? (
        <div>
          <p>Token:</p>
          <code>{token}</code>
          <br />
          {user ? (
            <div>
              <p>User:</p>
              <code>{JSON.stringify(user)}</code>
            </div>
          ) : (
            <p>No profile found.</p>
          )}
          <br />
          <Link to="/logout">Logout</Link>
        </div>
      ) : (
        <p>No token found. Please login.</p>
      )}
    </div>
  );
};

export default Home;
