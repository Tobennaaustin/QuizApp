// AppRouter.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Quiz from "./quiz";
import Login from "./login";
import Signup from "./signup";
import Home from "./Home";
import Leaderboard from "./Leaderboard";

const App= () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
