import React from "react";

const quotes = [
  "Every day is a chance to learn something new!",
  "Trivia sharpens the mind! 💡",
  "Great minds love great questions.",
  "Today’s quiz might surprise you 🤓",
];

export default function SplashScreen() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white animate-fade-in">
      <div className="text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-wide">Quizzo</h1>
        <p className="text-lg mt-4">{quote}</p>
        <p className="text-sm mt-2 opacity-80 animate-bounce">Loading...</p>
      </div>
    </div>
  );
}
