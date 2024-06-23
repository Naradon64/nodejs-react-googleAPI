import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import "./signup.css";

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<number>();
  const [address, setAddress] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:5050/register", {
        name,
        email,
        password,
        age,
        address,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const handleDebug = () => {
    console.log("Address:", address);
    console.log("Coordinates:", coordinates);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    id="name"
                    name="name"
                    placeholder="Enter Name"
                    autoComplete="off"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="Enter Email"
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control rounded-0"
                      id="password"
                      name="password"
                      placeholder="Enter Password"
                      autoComplete="off"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="input-group-text bg-white border-0 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="age" className="form-label">
                    Age
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    id="age"
                    name="age"
                    placeholder="Enter Age"
                    autoComplete="off"
                    onChange={(e) => {
                      const value = e.target.value;
                      setAge(value ? parseInt(value, 10) : undefined);
                    }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
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
                          className="form-control rounded-0"
                          required
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
                  <div className="mt-2">
                    <p className="mb-1">Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lng}</p>
                  </div>
                  <GoogleMap
                    mapContainerStyle={{
                      width: "540px",
                      height: "300px",
                    }}
                    center={{
                      lat: coordinates.lat || 0,
                      lng: coordinates.lng || 0,
                    }}
                    zoom={15}
                  >
                    {/* Child components, such as markers, info windows, etc. */}
                    <MarkerF
                      position={{
                        lat: coordinates.lat || 0,
                        lng: coordinates.lng || 0,
                      }}
                    />
                  </GoogleMap>
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100 rounded-0"
                >
                  Register
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100 rounded-0 mt-3"
                  onClick={handleDebug}
                >
                  Debug
                </button>
                <p className="mt-3 mb-0 text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="btn btn-link p-0">
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
