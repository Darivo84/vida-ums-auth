import React from "react";
import { useHistory } from "react-router-dom"

const Dashboard = () => {

    const history = useHistory()

    return (
      <div>
        <h1>Dashboard</h1>

        <button
          style={{
            height: "inherit",
            backgroundColor: "#f50057",
            color: "#fff",
            borderRadius: "10px",
            padding: "10px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        onClick={() => {
            localStorage.clear()
            history.push("/login")
        }}
        >
          Logout
        </button>
      </div>
    );
}

export default Dashboard;