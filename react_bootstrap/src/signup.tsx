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

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    age: 0,
    address: "",
    latitude: null,
    longitude: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setData((prevData) => ({
      ...prevData,
      address: value,
      latitude: latLng.lat,
      longitude: latLng.lng,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5050/register", data)
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const handleDebug = () => {
    console.log("Age:", data.age);
    console.log("Address:", data.address);
    console.log("Coordinates:", { lat: data.latitude, lng: data.longitude });
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
                  onChange={({ data, errors }) => setData(data)}
                />
                <div className="mb-3 position-relative">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <PlacesAutocomplete
                    value={data.address}
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
                    <p className="mb-1">Latitude: {data.latitude}</p>
                    <p>Longitude: {data.longitude}</p>
                  </div>
                  <GoogleMap
                    mapContainerStyle={{
                      width: "540px",
                      height: "300px",
                    }}
                    center={{
                      lat: data.latitude || 0,
                      lng: data.longitude || 0,
                    }}
                    zoom={15}
                  >
                    <MarkerF
                      position={{
                        lat: data.latitude || 0,
                        lng: data.longitude || 0,
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

export default Register;
