import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./signup.tsx";
import Login from "./login.tsx";
import Home from "./home.tsx";
import Logout from "./logout.tsx";
import Profile from "./profile.tsx";
import Intro from "./mapPage.tsx";
import Content from "./content.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/map/:id" element={<Intro />}></Route>
        <Route path="/content/" element={<Content />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
