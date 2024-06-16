import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<number>();
  const [address, setAddress] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:5050/register", { name, email, password, age, address })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    id="name"
                    name="name"
                    placeholder="Enter Name"
                    autoComplete="off"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="Enter Email"
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-0"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="age" className="form-label">
                    Age
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    id="age"
                    name="age"
                    placeholder="Enter Age"
                    autoComplete="off"
                    onChange={(e) => {
                      // convert to int
                      const value = e.target.value;
                      setAge(value ? parseInt(value, 10) : undefined);
                    }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    id="address"
                    name="address"
                    placeholder="Enter Address"
                    autoComplete="off"
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100 rounded-0"
                >
                  Register
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

export default Signup;
