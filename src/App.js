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
import {AuthProvider} from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UserRole from "./constants/UserRole";
import Logout from "./pages/Logout";

function App() {
  const authenticatedRoles = [UserRole.ADMIN, UserRole.MEMBER];
  const guestRoles = [UserRole.GUEST];
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/managerChat" element={<ProtectedRoute allowedRoles={authenticatedRoles}><ManagerChatPage /></ProtectedRoute>} />
            <Route path="/createChat" element={<ProtectedRoute allowedRoles={authenticatedRoles}><CreateChatPage /></ProtectedRoute>} />
            <Route path="/createChat2" element={<ProtectedRoute allowedRoles={authenticatedRoles}><CreateChatPageStep2 /></ProtectedRoute>} />
            <Route path="/chatM" element={<ProtectedRoute allowedRoles={authenticatedRoles}><ChatPageM /></ProtectedRoute>} />
            <Route path="/chatS" element={<ProtectedRoute allowedRoles={authenticatedRoles}><ChatPageS /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute allowedRoles={authenticatedRoles}><StaffPage /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute allowedRoles={guestRoles}><LoginPage /></ProtectedRoute>} />
            <Route path="/manageSignup" element={<ProtectedRoute allowedRoles={guestRoles}><SignupPageManager /></ProtectedRoute>} />
            <Route path="/staffSignup" element={<ProtectedRoute allowedRoles={guestRoles}><SignupPageStaff /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute allowedRoles={authenticatedRoles}><ReportPage /></ProtectedRoute>} />
            <Route path="/reportList" element={<ProtectedRoute allowedRoles={authenticatedRoles}><ReportListPage /></ProtectedRoute>} />
            <Route path="/staffChat" element={<ProtectedRoute allowedRoles={authenticatedRoles}><StaffChatPage /></ProtectedRoute>} />
            <Route path="/checkList" element={<ProtectedRoute allowedRoles={authenticatedRoles}><CheckListPage /></ProtectedRoute>} />
            <Route path="/chat1/:teamId" element={<ProtectedRoute allowedRoles={authenticatedRoles}><ChatPageM /></ProtectedRoute>} />
            <Route path="/chat2/:teamId" element={<ProtectedRoute allowedRoles={authenticatedRoles}><ChatPageS /></ProtectedRoute>} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
