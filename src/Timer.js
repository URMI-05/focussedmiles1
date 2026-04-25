import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const activity = location.state?.activity;

  // ⏱ Timer logic
  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  // 🎯 Stop timer
  const stopTimer = () => {
    setRunning(false);

    const minutes = Math.floor(seconds / 60);
    const points = minutes * 10;

    const messages = [
      "Great focus! ",
      "You're improving ",
      "Keep going "
    ];

    const message =
      messages[Math.floor(Math.random() * messages.length)];

    alert(`Time: ${minutes} mins\nPoints: ${points}\n${message}`);

    navigate("/dashboard");
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h2>{activity}</h2>

        <h1>{seconds}s</h1>

        {!running ? (
          <button onClick={() => setRunning(true)}>Start</button>
        ) : (
          <button onClick={stopTimer}>Stop</button>
        )}
      </div>
    </div>
  );
}

export default Timer;