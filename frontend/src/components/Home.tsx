import React, { useState, useEffect } from "react";
import { createBox, getBoxes } from '../api/boxApi';
import axios from "../AxiosConfig";
import BoxList from './BoxList';

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState("");
  const [boxName, setBoxName] = useState('');
  const [boxes, setBoxes] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = parseInt(localStorage.getItem("user_id") || "0", 10);
    const result = await createBox(boxName, userId);
    if (result) {
      alert('Box created successfully!');
      loadBoxes();
    } else {
      alert('Error creating box');
    }
  };

  const loadBoxes = async () => {
    const boxes = await getBoxes();
    setBoxes(boxes);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("access");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get("/auth/user/", config);
        setUsername(response.data.username);
        localStorage.setItem("user_id", response.data.id);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
    loadBoxes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {username}!</p>
      <h1>Create Box</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="boxName">Box Name:</label>
        <input
          type="text"
          id="boxName"
          value={boxName}
          onChange={(e) => setBoxName(e.target.value)}
        />
        <button type="submit">Create Box</button>
      </form>
      <BoxList boxes={boxes} />
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

export default Dashboard;
