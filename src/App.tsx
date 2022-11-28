function App() {
  return (
    <div>
      <nav>
        <h1>Note Web</h1>
      </nav>
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: "20%", border: "1px solid" }}>
          <h3>Labels</h3>
        </div>
        <div style={{ width: "30%", border: "1px solid" }}>
          <h3>Memo List</h3>
        </div>
        <div style={{ width: "50%", border: "1px solid" }}>
          <h3>Memo Detail</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
