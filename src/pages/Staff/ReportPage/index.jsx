import React, { useState, useRef } from "react";
import Recorder from "recorder-js";
import axios from "axios";
import NavBar from "./NavBar";
import BottomNav from "./BottomNav";
import "./style.css";
import API_HOST from "../../../constants/ApiHost"; 

export default function ReportPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
  const recorder = useRef(new Recorder(audioContext.current));

  const userId = localStorage.getItem("userId"); 
  const adminId = localStorage.getItem("adminId"); 

  // 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.current.init(stream);
      recorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("마이크 접근 실패:", error);
    }
  };

  // 녹음 중지 및 저장
  const stopRecording = async () => {
    try {
      const { blob } = await recorder.current.stop();
      setAudioBlob(blob);
      setIsRecording(false);
    } catch (error) {
      console.error("녹음 중지 실패:", error);
    }
  };

  // 서버로 녹음 파일 업로드
  const uploadAudio = async () => {
    if (!audioBlob) {
      alert("먼저 음성을 녹음하세요!");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "report-audio.mp3");
    formData.append("userId", userId); 
    formData.append("adminId", adminId); 

    try {
      const response = await axios.post(`${API_HOST}/report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.isSuccess) {
        alert("신고가 성공적으로 접수되었습니다!");
        setAudioBlob(null);
      } else {
        alert("신고 접수 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("오디오 업로드 실패:", error);
      alert("⚠️ 서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="report-page">
      <NavBar />

      <div className="report-content">
        <h2 className="report-title">EMERGENCY</h2>
        <p className="report-text">
          근로자는 위급상황 발생 시 <br />
          관리자에게 도움을 요청할 수 있어요
        </p>
        <p className="report-subtext">*버튼을 눌러 음성으로 말씀하세요</p>

        {/* 신고 버튼 */}
        <button
          className={`report-button ${isRecording ? "recording" : ""}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "⏹ 녹음 중지" : "🎤 신고하기"}
        </button>

        {/* 업로드 버튼 - 녹음이 완료되면 활성화 */}
        <button className="upload-button" onClick={uploadAudio} disabled={!audioBlob}>
          🚀 신고 전송
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
