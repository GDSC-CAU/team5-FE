import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Maneger_ChatPage from "./pages/Maneger_ChatPage"; // ChatPage 연결
import Create_ChatPage from "./pages/Create_ChatPage";
import Create_ChatPage_Step2 from "./pages/Create_ChatPage_Step2";
import ChatPage_M from "./pages/ChatPage_M";
import StaffPage from "./pages/StaffPage";
import LoginPage from "./pages/LoginPage";
import SignupPage_Maneger from "./pages/SignupPage_Maneger";
import SignupPage_Staff from "./pages/SignupPage_Staff";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/Maneger_Chat" element={<Maneger_ChatPage />} />
          <Route path="/Create_Chat" element={<Create_ChatPage />} />
          <Route path="/Create_Chat2" element={<Create_ChatPage_Step2 />} />
          <Route path="/Chat_M" element={<ChatPage_M />} />
          <Route path="/Staff" element={<StaffPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/manegesignup" element={<SignupPage_Maneger />} />
          <Route path="/staffsignup" element={<SignupPage_Staff />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
