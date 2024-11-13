import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EmotionDetection from "./pages/EmotionDetection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/emotion-detection" element={<EmotionDetection />} />
      </Routes>
    </Router>
  );
}

export default App;
