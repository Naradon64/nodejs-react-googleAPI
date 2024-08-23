import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, TextField, Link } from "@mui/material";

const Login2: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const response = await axios.post("/api/login", { email, password });
      console.log(response.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    console.log("Logout clicked");
    try {
      const response = await axios.post("/api/logout");
      console.log(response.data);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleForgotPassword = async () => {
    console.log("Forgot password clicked");
    try {
      const response = await axios.post("/api/forgot-password", { email });
      console.log(response.data);
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-200">
        <div>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
            <Button
              variant="outlined"
              onClick={handleLogin}
              sx={{ flex: 1, marginRight: "5px" }}
            >
              ok
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
              sx={{ flex: 1, marginRight: "5px" }}
            >
              ออก
            </Button>
          <Typography
            variant="body2"
            className="text-center mt-4 text-blue-500 font-bold"
          >
            If you forget your password,{" "}
            <Link
              href="#"
              onClick={handleForgotPassword}
              underline="hover"
              color="primary"
            >
              click here
            </Link>
            .
          </Typography>
        </div>
    </div>
  );
};

export default Login2;
