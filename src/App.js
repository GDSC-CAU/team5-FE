import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ManagerChatPage from "./pages/Manager/ManagerChatPage"; // ChatPage 연결
import CreateChatPage from "./pages/Manager/CreateChatPage";
import CreateChatPageStep2 from "./pages/Manager/CreateChatPageStep2";
import ChatPageM from "./pages/Manager/ChatPageM";
import ChatPageS from "./pages/Staff/ChatPageS";
import StaffPage from "./pages/Manager/StaffPage";
import LoginPage from "./pages/LoginPage";
import SignupPageManager from "./pages/SignupPageManager";
import SignupPageStaff from "./pages/SignupPageStaff";
import ReportPage from "./pages/Staff/ReportPage";
import ReportListPage from "./pages/Manager/ReportListPage";
import StaffChatPage from "./pages/Staff/StaffChatPage";
import CheckListPage from "./pages/Staff/CheckListPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/managerChat" element={<ManagerChatPage />} />
          <Route path="/createChat" element={<CreateChatPage />} />
          <Route path="/createChat2" element={<CreateChatPageStep2 />} />
          <Route path="/chatM" element={<ChatPageM />} />
          <Route path="/chatS" element={<ChatPageS />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/manegesignup" element={<SignupPageManager />} />
          <Route path="/staffsignup" element={<SignupPageStaff />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/reportlist" element={<ReportListPage />} />
          <Route path="/staffChat" element={<StaffChatPage />} />
          <Route path="/checkList" element={<CheckListPage />} />
          <Route path="/chat1/:teamId" element={<ChatPageM />} />
          <Route path="/chat2/:teamId" element={<ChatPageS />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
