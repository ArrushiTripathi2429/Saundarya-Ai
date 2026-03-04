"use client";

export default function TestPage() {

  const testConnection = async () => {
    try {
      const res = await fetch("http://localhost:8000/health");
      const data = await res.json();
      console.log("Backend Response:", data);
      alert(JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
      alert("Connection Failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Backend Connection Test</h1>
      <button onClick={testConnection}>
        Test Backend
      </button>
    </div>
  );
}
