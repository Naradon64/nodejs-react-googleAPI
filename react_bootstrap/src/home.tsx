import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Home.module.css"; // Import the CSS module

// Define the User type
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  address: string;
};

const Home: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // store storedToken value to token value on the top
      // Get user data here
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

  useEffect(() => {
    if (token) {
      // the function will triggered when the depencency change but the purpose of "if (token)" is to check if Token actually exist
      axios
        .get("http://localhost:5050/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUsers(response.data))
        .catch((err) => console.log(err));
    }
  }, [token]); // [token] คือ dependency ของฟังก์ชั่นนี้ หาก token เปลี่ยน จะมีการรัน ฟังก์ชั่นนี้

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Home Page</div>
        <Link to="/logout" className={styles.sidebarLogout}>
          Logout
        </Link>
      </div>
      <div className={styles.mainContent}>
        <h2>Homepage</h2>
        {token ? (
          <div className={styles.infoBox}>
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
          </div>
        ) : (
          <div className={styles.infoBox}>
            <p>No token found. Please login.</p>
            <Link to="/login">Login</Link>
          </div>
        )}

        {/* Show users information table */}
        {token && users.length > 0 && (
          <div className={`${styles.infoBox} ${styles.tableContainer}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td>{user.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
