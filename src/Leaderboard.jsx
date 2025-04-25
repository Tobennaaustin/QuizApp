import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(
        collection(db, "users"),
        orderBy("score", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const topScores = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        position: index + 1,
      }));
      setLeaderboard(topScores);
    };

    fetchLeaderboard();
  }, []);

  const HandleLink = () => {
    window.location.href = "/quiz";
    };                                         

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  const maxScore = Math.max(...topThree.map((e) => e.score || 0), 1); 

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6">
          <div className="mt-6 w-full max-w-2xl mx-auto px-4">
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">
              🏆 Leaderboard
            </h3>

            
            <div className="flex justify-center items-end gap-6 sm:gap-10 h-48 sm:h-56 mb-10">
              {[1, 0, 2].map((i) => {
                const entry = topThree[i];
                if (!entry) return null;

                //   const barHeight = `${(entry.score / maxScore) * 100}%`;
                const barHeight = `${100 - i * 20}px`;
                const colors = [
                  "bg-yellow-400",
                  "bg-gray-400",
                  "bg-orange-400",
                ];
                const initials = entry.name?.slice(0, 2).toUpperCase();
                const rank = ["🥇", "🥈", "🥉"][entry.position - 1];

                return (
                  <div key={entry.id} className="flex flex-col items-center">
                    <div
                      className={`w-12 ${colors[i]} rounded-t-md text-white font-bold flex items-end justify-center transition-all`}
                      style={{ height: barHeight }}
                    >
                      {entry.score}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-center">
                      {rank}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {initials}
                    </div>
                  </div>
                );
              })}
            </div>

            
            {others.length > 0 && (
              <ul className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-3 max-h-64 overflow-y-auto animate-fade-in">
                {others.map((entry) => {
                  const initials = entry.name?.slice(0, 2).toUpperCase();
                  return (
                    <>
                      <li
                        key={entry.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center justify-between gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-white">
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              #{entry.position} {entry.name}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-blue-600 dark:text-blue-300">
                          {entry.score}
                        </span>
                      </li>
                    </>
                  );
                })}
              </ul>
            )}
          </div>

          <button
            onClick={HandleLink}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg"
          >
            Take the Quiz
          </button>
        </div>
      </div>
    </>
  );
}
