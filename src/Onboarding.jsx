import React, { useState } from "react";
import Confetti from "react-confetti";
import useSound from "use-sound";

const successSound = "/sounds/success.mp3"; // Add your sound to public/sounds

const screens = [
  {
    title: "Welcome to Quizzo!",
    desc: "Challenge your mind with daily trivia and quizzes.",
    emoji: "🧠",
  },
  {
    title: "Track Your Progress",
    desc: "Unlock badges and climb the leaderboard!",
    emoji: "📈",
  },
  {
    title: "Customize Experience",
    desc: "Switch themes, choose topics, and set goals.",
    emoji: "🎯",
  },
];

export default function Onboarding({ toggleTheme, darkMode, onFinish }) {
  const [index, setIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSuccess] = useSound(successSound);

  const current = screens[index];

  const next = () => {
    if (index < screens.length - 1) {
      setIndex(index + 1);
    } else {
      playSuccess();
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        onFinish(); // transition to quiz
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen p-6 text-center transition-all relative">
      {showConfetti && <Confetti />}
      {/* <div className="flex justify-end w-full">
        <button
          onClick={toggleTheme}
          className="text-sm bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full"
        >
          {darkMode ? "☀️ Day Mode" : "🌙 Night Mode"}
        </button>
      </div> */}

      <div className="mt-8">
        <div className="text-6xl">{current.emoji}</div>
        <h2 className="text-3xl font-bold mt-6">{current.title}</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{current.desc}</p>
      </div>

      <div className="w-full">
        <div className="flex justify-center gap-2 mb-6">
          {screens.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-blue-500" : "bg-gray-400 dark:bg-gray-600"
              }`}
            ></span>
          ))}
        </div>

        <button
          onClick={next}
          disabled={showConfetti}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
        >
          {index === screens.length - 1 ? "Start Quizzo" : "Next"}
        </button>
      </div>
    </div>
  );
}
