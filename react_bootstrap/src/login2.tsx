import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, TextField, Link } from "@mui/material";
import backgroundImage from '/1.jpg';

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
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <div style={{ 
                position: 'absolute', 
                width: '100%', 
                height: '100%', 
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
        }}>
                
        </div>
        <div style={{ 
                position: 'absolute', 
                right: 0, 
                width: '30%', 
                height: '100%', 
                backgroundColor: 'rgba(0, 150, 169, 0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: "column"
            }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: "column",
                gap: '10px'
            }}>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                fontSize: '16px',
                outline: 'none',
                width: '100%',
                }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    outline: 'none',
                }}
            />
            </div>
            <div className="mt-2">
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{ 
                        flex: 1, 
                        marginRight: "5px",
                    }}
                >
                    ok
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    sx={{ 
                        flex: 1, 
                        marginRight: "5px",
                    }}
                >
                    ออก
                </Button>
            </div>
            <div className="mt-3">
                <p style={{
                    color: 'white'
                }}>
                    If you forget your password, <a href="/forgot-password" style={{ color: 'blue', textDecoration: 'underline' }}>click here</a>.
                </p>
            </div>
        </div>
    </div>
  );
};

export default Login2;
