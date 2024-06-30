import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { JsonForms } from "@jsonforms/react";
import loginSchema from "./json_schema/loginSchema.json";
import loginUiSchema from "./json_schema/loginUischema.json";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";

const Login = () => {
  const [formData, setFormData] = useState<{ email: string; password: string } | null>(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateData = (data: { email: string; password: string } | null): string[] => {
    const errors: string[] = [];
    if (!data) {
      errors.push("Form data is missing");
      return errors;
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) errors.push("Invalid email address");
    if (!data.password || data.password.length < 6) errors.push("Password must be at least 6 characters long");
    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]); // Reset validation errors
    setServerError(null); // Reset server error
    const validationErrors = validateData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    axios
      .post<{ user: any; token: string }>("http://localhost:5050/login", formData)
      .then((response) => {
        const { token } = response.data;

        // Save token in localStorage
        localStorage.setItem("token", token);

        // Navigate to home page
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          setServerError("Password is not correct");
        }
        else if (err.response && err.response.status === 404) {
          setServerError("User not found");
        } else {
          setServerError("An error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form onSubmit={handleSubmit}>
                <JsonForms
                  schema={loginSchema}
                  uischema={loginUiSchema}
                  data={formData}
                  renderers={materialRenderers}
                  cells={materialCells}
                  onChange={({ data }) => setFormData(data)}
                />
                {/* errors จะแสดงผลถ้าใส่ input ไม่ถูก */}
                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <ul>
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {serverError && (
                  <div className="alert alert-danger">
                    {serverError}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-0"
                >
                  Login
                </button>
                <p className="mt-3 mb-0 text-center">
                  Don't have an account?{" "}
                  <Link to="/register" className="btn btn-link p-0">
                    Register
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

export default Login;
