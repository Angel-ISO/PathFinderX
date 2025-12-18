import "./MatLoader.css";

export default function MatLoader({ text = "Cargando la experiencia PathFinderX..." }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "#00ff88",
        textAlign: "center"
      }}
    >
      <div className="ai-matrix-loader">
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="digit">1</div>
        <div className="digit">0</div>
        <div className="digit">0</div>
        <div className="digit">1</div>
        <div className="glow"></div>
      </div>
      <p style={{ marginTop: "20px", fontSize: "1.1rem", fontFamily: "monospace" }}>
        {text}
      </p>
    </div>
  );
}