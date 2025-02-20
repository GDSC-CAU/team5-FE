import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Maneger_ChatPage from "./pages/Maneger_ChatPage"; // ChatPage 연결
import Create_ChatPage from "./pages/Create_ChatPage";
import Create_ChatPage_Step2 from "./pages/Create_ChatPage_Step2";
import ChatPage_M from "./pages/ChatPage_M";
import StaffPage from "./pages/StaffPage";
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
