import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ManagerChatPage from "./pages/Manager/ManagerChatPage"; // ChatPage 연결
import CreateChatPage from "./pages/CreateChatPage";
import CreateChatPageStep2 from "./pages/CreateChatPageStep2";
import ChatPageM from "./pages/ChatPageM";
import StaffPage from "./pages/StaffPage";
import LoginPage from "./pages/LoginPage";
import SignupPageManager from "./pages/SignupPageManager";
import SignupPageStaff from "./pages/SignupPageStaff";
import ReportPage from "./pages/ReportPage";
import ReportListPage from "./pages/Manager/ReportListPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/ManagerChat" element={<ManagerChatPage />} />
          <Route path="/CreateChat" element={<CreateChatPage />} />
          <Route path="/CreateChat2" element={<CreateChatPageStep2 />} />
          <Route path="/ChatM" element={<ChatPageM />} />
          <Route path="/Staff" element={<StaffPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/manegesignup" element={<SignupPageManager />} />
          <Route path="/staffsignup" element={<SignupPageStaff />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/reportlist" element={<ReportListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
