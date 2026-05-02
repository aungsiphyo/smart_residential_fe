import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const SosAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Parking States
  const [parkingData, setParkingData] = useState({
    total_available: 50,
    left_available: 25,
    right_available: 25,
  });

  const audioRef = useRef(
    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
  );

  useEffect(() => {
    // SOS Listener
    socket.on("sos_alert", (data) => {
      setAlerts((prev) =>
        prev.find((a) => a.room === data.room) ? prev : [data, ...prev]
      );
      if (soundEnabled) {
        audioRef.current.play().catch(() => {});
      }
    });

    // Parking Listener - Receives data directly from ESP32 via Backend
    socket.on("parking_update", (data) => {
      setParkingData(data);
    });

    return () => {
      socket.off("sos_alert");
      socket.off("parking_update");
    };
  }, [soundEnabled]);

  const handleAction = (alert, action, index) => {
    socket.emit("sos_control", { ...alert, action });
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  const enableSound = () => {
    audioRef.current.play().then(() => {
      audioRef.current.pause();
      setSoundEnabled(true);
    });
  };

  return (
    <div className="sos-alerts-page">
      <div className="sidebar">
        <h2>Active SOS Alerts</h2>
        <p>Real-time monitoring of emergency signals across all sectors.</p>
        <button className="alert-history-btn">Alert History</button>
      </div>

      <div className="main-content">
        <div className="parking-section">
          <div className="parking-card total">
            <h3>Total Available</h3>
            <p>{parkingData.total_available}</p>
          </div>
          <div className="parking-card left">
            <h3>Left Section</h3>
            <p>{parkingData.left_available} / 25</p>
          </div>
          <div className="parking-card right">
            <h3>Right Section</h3>
            <p>{parkingData.right_available} / 25</p>
          </div>
        </div>

        <div className="sos-section">
          <h2>SOS Alerts</h2>
          {!soundEnabled && (
            <button onClick={enableSound} className="enable-sound-btn">
              Enable Sound
            </button>
          )}

          {alerts.length === 0 && (
            <p className="no-alerts">No emergency alerts at this time.</p>
          )}

          {alerts.map((alert, index) => (
            <div key={index} className="alert-box">
              <div className="alert-details">
                <h3>{alert.type || "Emergency"}</h3>
                <p>Resident: {alert.resident || "Unknown"}</p>
                <p>Location: {alert.location || "Unknown"}</p>
                <p>Status: {alert.status || "Pending"}</p>
              </div>
              <div className="alert-actions">
                <button
                  onClick={() => handleAction(alert, "RESOLVE", index)}
                  className="resolve-btn"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleAction(alert, "DISPATCH", index)}
                  className="dispatch-btn"
                >
                  Dispatch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sos-alerts-page {
          display: flex;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7f6;
          min-height: 100vh;
        }

        .sidebar {
          width: 250px;
          background-color: #2c3e50;
          color: white;
          padding: 20px;
        }

        .sidebar h2 {
          margin-bottom: 10px;
        }

        .alert-history-btn {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }

        .main-content {
          flex: 1;
          padding: 20px;
        }

        .parking-section {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .parking-card {
          background-color: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          min-width: 180px;
        }

        .parking-card.total {
          border-top: 8px solid #3498db;
        }

        .parking-card.left {
          border-top: 8px solid #2ecc71;
        }

        .parking-card.right {
          border-top: 8px solid #e67e22;
        }

        .sos-section {
          max-width: 600px;
          margin: 0 auto;
        }

        .enable-sound-btn {
          background-color: #95a5a6;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        .no-alerts {
          color: #7f8c8d;
        }

        .alert-box {
          background-color: #fff;
          border: 2px solid #e74c3c;
          border-radius: 10px;
          padding: 20px;
          margin-top: 15px;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
        }

        .alert-details h3 {
          color: #e74c3c;
        }

        .alert-actions {
          display: flex;
          gap: 10px;
        }

        .resolve-btn {
          background-color: #27ae60;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        .dispatch-btn {
          background-color: #c0392b;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default SosAlertsPage;