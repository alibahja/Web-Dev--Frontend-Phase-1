import React from "react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>
      <p>Welcome to the Library Management System</p>

      {user && (
        <div>
          <p><strong>Name:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;