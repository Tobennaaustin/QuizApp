import React, { useEffect, useState } from "react";
import Onboarding from "./Onboarding";
import SplashScreen from "./SplashScreen";
import Signup from "./signup"; 

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("quizzo_onboarded");
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem("quizzo_onboarded", "true");
    setShowOnboarding(false);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen transition duration-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        {showSplash ? (
          <SplashScreen />
        ) : showOnboarding ? (
          <Onboarding
            toggleTheme={() => setDarkMode(!darkMode)}
            darkMode={darkMode}
            onFinish={handleFinishOnboarding}
          />
        ) : (
          <Signup />
        )}
      </div>
    </div>
  );
}
