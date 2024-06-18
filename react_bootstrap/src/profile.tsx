import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.css"; // Import the CSS module

// Define the User type
type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    address: string;
  };

const Profile: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);

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
        axios
        .get("http://localhost:5050/users/:_id", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            setUser(response.data); // Set user data when fetched
            setEditedUser(response.data); // Initialize editedUser with user data
        })
        .catch((err) => console.log(err));
    }
    }, [token]);

    const handleEditClick = () => {
        setIsEditing(true);
        if (user) {
            setEditedUser(user);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedUser) {
            setEditedUser({
                ...editedUser,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSaveClick = () => {
        if (token && editedUser) {
            axios
              .put(
                `http://localhost:5050/users/${editedUser.id}`,
                { ...editedUser },
                { headers: { Authorization: `Bearer ${token}` } }
              )
              .then((response) => {
                setUser(response.data);
                setIsEditing(false);
              })
              .catch((err) => console.log(err));
          }
    };

    return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div>
        <Link to="/home" className={styles.sidebarHeader}>
          Home Page
        </Link>
          <div>
            <Link to="/profile" className={styles.sidebarProfile}>
              My Profile
            </Link>
          </div>
        </div>
        <Link to="/logout" className={styles.sidebarLogout}>
          Logout
        </Link>
      </div>
        <div className={styles.mainContent}>
            <h1>My profile</h1>
            {user ? (
                <div className={styles.infoBox}>
                    {/* ถ้ากดปุ่ม edit isEditing จะ true ทำให้เข้าอันนี้ */}
                    {isEditing ? (
                    <>
                        <div className={styles.itemStyle}>
                            <strong>Name</strong>
                            <input
                                type="text"
                                name="name"
                                value={editedUser?.name || ""}
                                onChange={handleInputChange}
                                className={styles.inputStyle}
                            />
                        </div>
                        <div className={styles.itemStyle}>
                            <strong>Email</strong>
                            <input
                                type="email"
                                name="email"
                                value={editedUser?.email || ""}
                                onChange={handleInputChange}
                                className={styles.inputStyle}
                            />
                        </div>
                        <div className={styles.itemStyle}>
                            <strong>Age</strong>
                            <input
                                type="number"
                                name="age"
                                value={editedUser?.age || ""}
                                onChange={handleInputChange}
                                className={styles.inputStyle}
                            />
                        </div>
                        <div className={styles.itemStyle}>
                            <strong>Address</strong>
                            <input
                                type="text"
                                name="address"
                                value={editedUser?.address || ""}
                                onChange={handleInputChange}
                                className={styles.inputStyle}
                            />
                        </div>
                        <button onClick={handleSaveClick}>Save</button>
                    </>
                    ) : (
                    <>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Age:</strong> {user.age}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <button onClick={handleEditClick}> Edit </button>
                    </>
                    )}
                </div>
            ) : (
                <div>No user data available.</div>
            )}
        </div>
    </div>
    )
}

export default Profile;