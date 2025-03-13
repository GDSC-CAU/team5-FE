import React from "react";
import NavBar from "./NavBar"; // 기존 네비게이션 가져오기
import BottomNav from "./BottomNav"; // 기존 네비게이션 가져오기
import "./style.css"; // 스타일 적용

// 더미 신고 데이터
const reports = [
  { id: 1, title: "콘크리트 바닥 잘못 됨", date: "2025.01.03 10:00" },
  { id: 2, title: "안전모 미착용", date: "2025.01.03 12:00" },
];

export default function ReportListPage() {
  return (
    <div className="app-page report-list-page">
      <NavBar />

      {/* 신고 리스트 컨테이너 */}
      <div className="report-list">
        {reports.map((report) => (
          <div key={report.id} className="report-item">
            <p className="report-title">{report.title}</p>
            <div className="report-info">
              <span className="report-label">날짜</span>
              <span className="report-date">{report.date}</span>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
