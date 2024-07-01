import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import axios from "axios";
import { useParams } from "react-router-dom";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const Intro: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const url = import.meta.env.VITE_BASE_URL; // import URL from .env

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // set token
      // verify

      axios
        .get(`${url}users/${id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((userData) => {
          console.log(userData); // check if the userData acatully exist
          setAddress(userData.data.address ?? "");
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }

    // Call google map key from backend to insert it on front end, delete this if you don't want it because there is no use.
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(`${url}api/get-google-maps-api-key`);
        setApiKey(response.data.apiKey);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApiKey();
  }, []);

  // console.log(id); // Check if there is an ID being passed here

  const getUserAddressToLatLng = async (address: string) => {
    //convert string address to latitude longitude by geocode
    const results = await geocodeByAddress(address);
    const latLng = await getLatLng(results[0]);
    setCoordinates(latLng);
  };

  // เรียกฟังก์ชันเพื่อเอา user.address มาเปลี่ยนเป็น lat, lng
  useEffect(() => {
    if (address) {
      getUserAddressToLatLng(address);
    }
  }, [address]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "80vh",
        width: "80%",
      }}
    >
      <div>
        <h2>{address}</h2>
      </div>
      {apiKey && coordinates.lat !== null && coordinates.lng !== null && (
        // แสดง google map จาก lat, lng
        <APIProvider apiKey={apiKey}>
          <Map
            defaultZoom={15}
            defaultCenter={{ lat: coordinates.lat, lng: coordinates.lng }}
          >
            <Marker
              position={{ lat: coordinates.lat, lng: coordinates.lng }}
            ></Marker>
          </Map>
        </APIProvider>
      )}
    </div>
  );
};

export default Intro;
