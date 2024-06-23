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

  useEffect(() => {
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

  console.log(id);

  // Modify container of Map here
  //   const containerStyle = {
  //     position: "fixed",
  //     top: "50%",
  //     left: "50%",
  //     transform: "translate(-50%, -50%)",
  //     height: "80vh",
  //     width: "80%",
  //   };

  //   const position = { lat: 13, lng: 100.99 }; // location of Thailand

  // Render the map only when apiKey is available (That's why I'm using .fetch)
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
    // console.log(id)
  );
};

export default Intro;
