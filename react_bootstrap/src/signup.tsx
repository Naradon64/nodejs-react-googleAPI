import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import registerSchema from "./json_schema/registerSchema.json";
import registerUischema from "./json_schema/registerUischema.json";
import "./signup.css";

type Data = {
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
};

const Register = () => {
  const [data, setData] = useState<Data>();
  const [showPassword, setShowPassword] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const url = import.meta.env.VITE_BASE_URL; // import URL from .env

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setData((prevData) => ({
      ...prevData,
      address: value,
      latitude: latLng.lat,
      longitude: latLng.lng,
    }));
  };
  const validateData = (data: Data): string[] => {
    const errors: string[] = [];
    if (!data.name || data.name.length < 1) errors.push("Name is required");
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
      errors.push("Invalid email");
    if (!data.password || data.password.length < 6)
      errors.push("Password must be at least 6 characters long");
    if (!data.age || data.age < 1) errors.push("Age must be greater than 0");
    if (!data.address) errors.push("Address is required");
    if (!data.latitude) errors.push("Latitude is required");
    if (!data.longitude) errors.push("Longitude is required");
    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateData(data || {});
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    axios
      .post(`${url}register`, data)
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const handleDebug = () => {
    console.log("Age:", data?.age);
    console.log("Address:", data?.address);
    console.log("Coordinates:", { lat: data?.latitude, lng: data?.longitude });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Register</h2>
              <form
                onSubmit={handleSubmit}
                onFocus={() => setHasInteracted(true)}
                onChange={() => setHasInteracted(true)}
              >
                <JsonForms
                  schema={registerSchema}
                  uischema={registerUischema}
                  data={data}
                  renderers={materialRenderers}
                  cells={materialCells}
                  onChange={({ data }) => setData(data)}
                />
                <div className="mb-3 position-relative">
                  <PlacesAutocomplete
                    value={data?.address}
                    onChange={(value) =>
                      setData((prevData) => ({
                        ...prevData,
                        address: value,
                      }))
                    }
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
                    <p className="mb-1">Latitude: {data?.latitude}</p>
                    <p>Longitude: {data?.longitude}</p>
                  </div>
                  <GoogleMap
                    mapContainerStyle={{
                      width: "540px",
                      height: "300px",
                    }}
                    center={{
                      lat: data?.latitude || 0,
                      lng: data?.longitude || 0,
                    }}
                    zoom={15}
                  >
                    <MarkerF
                      position={{
                        lat: data?.latitude || 0,
                        lng: data?.longitude || 0,
                      }}
                    />
                  </GoogleMap>
                </div>
                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <ul>
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
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

export default Register;
