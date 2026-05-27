import "./FloatingRobot.css";

export default function FloatingRobot({ message = "", active = false }) {
  return (
    <div className={`floating-robot ${active ? "robot-active" : ""}`}>
      {active && <div className="robot-light-bulb">💡</div>}

      {message && (
        <div className="robot-speech-bubble">
          <span>{message}</span>
        </div>
      )}

      <div className="floating-robot-inner">
        <div className="floating-head">
          <div className="floating-eye"></div>
          <div className="floating-eye"></div>
        </div>

        <div className="floating-arms">
          <span></span>
          <span></span>
        </div>

        <div className="floating-body">
          <div className="floating-screen"></div>
          <div className="floating-label">AI</div>
          <div className="floating-button"></div>
        </div>

        <div className="floating-track">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}