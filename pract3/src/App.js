import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const currentDate = currentTime.toLocaleDateString();
  const currentTimeOnly = currentTime.toLocaleTimeString();

  return (
    <div className="app-background">
      <div className="main-card">
        <h1 className="welcome-text">👋 Welcome to CHARUSAT!</h1>

        <div className="info-container">
  <div className="info-row">
    <span className="label">📅 Current Date:</span>
    <span className="value">{currentDate}</span>
  </div>

  <div className="info-row">
    <span className="label">⏰ Current Time:</span>
    <span className="value">{currentTimeOnly}</span>
  </div>
</div>
      </div>
    </div>
  );
}

export default App;
