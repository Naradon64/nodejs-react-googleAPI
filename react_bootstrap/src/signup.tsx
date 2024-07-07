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
import {
  ThailandAddressTypeahead,
  ThailandAddressValue,
} from "react-thailand-address-typeahead";

const Register = () => {
  const [data, setData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const url = import.meta.env.VITE_BASE_URL; // import URL from .env
  const [val, setVal] = React.useState<ThailandAddressValue>(
    ThailandAddressValue.fromDatasourceItem({
      d: "",
      p: "",
      po: "",
      s: "",
    })
  );

  // function เชื่อม feild ทั้งหมดให้เป็น address
  const constructAddress = (data: any) => {
    const houseNumber = data.houseNumber ? `${data.houseNumber} ` : "";
    const villageBuilding = data.villageBuilding ? `หมู่บ้าน${data.villageBuilding} ` : "";
    const soi = data.soi ? `ซ.${data.soi} ` : "";
    const road = data.road ? `ถ.${data.road} ` : "";
    const subDistrict = data.subDistrict ? `ต.${data.subDistrict} ` : "";
    const district = data.district ? `อ.${data.district} ` : "";
    const province = data.province ? `จ.${data.province} ` : "";
    const postalCode = data.postalCode ? `${data.postalCode}` : "";

    return `${houseNumber}${villageBuilding}${soi}${road}${subDistrict}${district}${province}${postalCode}`.trim();
  };

  // function แปลง address ที่เป็น string ให้เป็น lat, lng
  const handleGeocode = async () => {
    const fullAddress = constructAddress(data);
    try {
      const results = await geocodeByAddress(fullAddress);
      const latLng = await getLatLng(results[0]);
      setData((prevData: any) => ({
        ...prevData,
        latitude: latLng.lat,
        longitude: latLng.lng,
      }));
    } catch (error) {
      console.error("Error getting geocode:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validation, if doesn't use this function, axios will send any json that exist in data to .post/register, which is not ideal
    if (errors.length > 0) {
      return;
    }

    // เรียก function ที่เชื่อม field ที่อยู่ในช่อง input ทั้งหมดให้เป็น address อันเดียว
    const fullAddress = constructAddress(data);
    const dataToSend = { ...data, address: fullAddress };
    
    // เรียก api ใช้ post เพื่อ register
    axios
      .post(`${url}register`, dataToSend)
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const handleDebug = () => {
    const fullAddress = constructAddress(data);
    const dataToSend = { ...data, address: fullAddress };
    console.log("Current form data:", dataToSend);
  };

  // เมื่อ select dropdown ของ <ThailandAddressTypeahead> แล้วให้ใส่เข้าไปในช่องของ json form
  const handleAddressChange = (val: ThailandAddressValue) => {
    setVal(val);
    setData((prevData: any) => ({
      ...prevData,
      subDistrict: val.subdistrict,
      district: val.district,
      province: val.province,
      postalCode: val.postalCode,
    }));
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
                  onChange={({ data, errors }: any) => {
                    setData(data);
                    // change old validation and update the validatino from json Form Schema instead
                    setErrors(errors.map((error: any) => error.message));
                  }}
                />

                <ThailandAddressTypeahead
                  value={val}
                  onValueChange={handleAddressChange}
                >
                  {/* <ThailandAddressTypeahead.SubdistrictInput placeholder="Tumbon" />
                  <ThailandAddressTypeahead.DistrictInput placeholder="Amphoe" /> */}
                  <div>
                    <div>ค้นหาจาก ตำบล อำเภอ จังหวัด จากรหัสไปรษณีย์</div>
                    {/* <ThailandAddressTypeahead.ProvinceInput placeholder="Province" /> */}
                    <ThailandAddressTypeahead.PostalCodeInput placeholder="Postal Code" />
                  </div>
                  <ThailandAddressTypeahead.Suggestion />
                </ThailandAddressTypeahead>

                <button
                  type="button"
                  className="btn btn-primary w-100 rounded-0 mt-2"
                  onClick={handleGeocode}
                >
                  view on googlemap
                </button>

                <div className="mb-3 position-relative">
                  {/*
                  <PlacesAutocomplete
                    value={data?.address}
                    onChange={(value) =>
                      setData((prevData: any) => ({
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
                  */}

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

                <button
                  type="submit"
                  className="btn btn-success w-100 rounded-0"
                >
                  Register
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100 rounded-0 mt-2"
                  onClick={handleDebug}
                >
                  Debug
                </button>
                <div>
                  {errors.length > 0 && (
                    <div className="alert alert-danger">
                      <ul>
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

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
