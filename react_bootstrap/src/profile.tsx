import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.css"; // Import the CSS module
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { GoogleMap, MarkerF } from '@react-google-maps/api';

// Define the User type
type User = {
  _id: string;
  name: string;
  email: string;
  age: number;
  address: string;
  latitude: number;
  longitude: number;
};

const Profile: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios
        .get("http://localhost:5050/verify", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          const userId = response.data.user._id;
          axios
            .get(`http://localhost:5050/users/${userId}`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            })
            .then((userData) => {
                console.log(userData);
              setUser(userData.data);
            })
            .catch((err) => {
              console.error("Error fetching user data:", err);
            });
        })
        .catch((err) => {
          console.error("Error verifying token:", err);
        });
    }
  }, []);

  const handleEditClick = async () => {
    setIsEditing(true);
    if (user) {
      setEditedUser(user);
      setAddress(user.address);
      // Geocode the current address to get the coordinates
      const results = await geocodeByAddress(user.address);
      const latLng = await getLatLng(results[0]);
      setCoordinates(latLng); // Set the coordinates state to the current user's coordinates
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

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);

    // Update the address and coordinates in the editedUser state
    if (editedUser) {
        setEditedUser({
          ...editedUser,
          address: value,
          latitude: latLng.lat,
          longitude: latLng.lng,
        });
    }
  };

  const handleSaveClick = () => {
    if (token && editedUser) {
      axios
        .put(
          `http://localhost:5050/users/${editedUser._id}`,
          { ...editedUser },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setUser(response.data);
          setIsEditing(false);
        })
        .catch((err) => {
          console.log(err);
        });
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
                  {/* <input
                    type="text"
                    name="address"
                    value={editedUser?.address || ""}
                    onChange={handleInputChange}
                    className={styles.inputStyle}
                  /> */}
                  <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <input
                            {...getInputProps({ placeholder: "Enter address" })}
                            type="text"
                            name="address"
                            value={address}
                            className={styles.inputStyle}
                        />
                        <div className="autocomplete-dropdown">
                          {loading && <div>...loading</div>}
                          {suggestions.map((suggestion) => {
                            const className = suggestion.active
                              ? "suggestion-item suggestion-item--active"
                              : "suggestion-item";
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                })}
                              >
                                {suggestion.description}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
                <div className="mt-2">
                    <p className="mb-1">Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lng}</p>
                </div>
                <GoogleMap
                    mapContainerStyle={{
                        width: '1000px',
                        height: '700px'
                      }}
                    center={{ lat: coordinates.lat || 0, lng: coordinates.lng || 0 }}
                    zoom={15}
                    >
                    { /* Child components, such as markers, info windows, etc. */ }
                    <MarkerF position={{ lat: coordinates.lat || 0, lng: coordinates.lng || 0 }} />
                </GoogleMap>
                <button onClick={handleSaveClick}>Save</button>
              </>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Age:</strong> {user.age}
                </p>
                <p>
                  <strong>Address:</strong> {user.address}
                </p>
                <p>
                  <strong>Latitude:</strong> {user.latitude}
                </p>
                <p>
                  <strong>Longtitude:</strong> {user.longitude}
                </p>
                <GoogleMap
                    mapContainerStyle={{
                        width: '1000px',
                        height: '700px'
                      }}
                    center={{ lat: user.latitude || 0, lng: user.longitude || 0 }}
                    zoom={15}
                    >
                    { /* Child components, such as markers, info windows, etc. */ }
                    <MarkerF position={{ lat: user.latitude || 0, lng: user.longitude || 0 }} />
                </GoogleMap>
                <button onClick={handleEditClick}> Edit </button>
              </>
            )}
          </div>
        ) : (
          <div>No user data available.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
