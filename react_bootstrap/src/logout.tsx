import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Navigate to login page
    navigate("/home");
  }, [navigate]);

  return (
    <div>
      <h2>Logout</h2>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
