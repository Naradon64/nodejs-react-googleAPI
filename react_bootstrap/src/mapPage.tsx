import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import axios from "axios";
import { useParams } from "react-router-dom";

const Intro: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // set token
      // verify

      axios
        .get(`http://localhost:5050/users/${id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((userData) => {
          console.log(userData); // check if the userData acatully exist
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }

    // Call google map key from backend to insert it on front end, delete this if you don't want it because there is no use.
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/api/get-google-maps-api-key"
        );
        setApiKey(response.data.apiKey);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApiKey();
  }, []);

  // console.log(id); // Check if there is an ID being passed here

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
      {apiKey && (
        <APIProvider apiKey={apiKey}>
          <Map defaultZoom={6} defaultCenter={{ lat: 13, lng: 100.99 }}></Map>
        </APIProvider>
      )}
    </div>
  );
};

export default Intro;
