import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import questions from "./questions.json";

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [leaderboard, setLeaderboard] = useState([]);

   const HandleLink = () => {
     window.location.href = "/quiz";
   };
   const HandleLinkLeaderboard = () => {
     window.location.href = "/leaderboard";
   };    

   const HandleLinkSignIn = () => {
     window.location.href = "/login";
   };

  const QUESTIONS_PER_PAGE = 10;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setTimer(60);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!submitted && user && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0 && !submitted) {
      handleSubmit();
    }
  }, [timer, submitted, user]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(
        collection(db, "users"),
        orderBy("score", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const topScores = snapshot.docs.map((doc, index) => ({
        ...doc.data(),
        position: index + 1,
      }));
      setLeaderboard(topScores);
    };
    fetchLeaderboard();
  }, [submitted]);

  const handleOptionChange = (questionId, option) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
    }
  };



const handleSubmit = async () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  let newScore = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.answer) {
      newScore++;
    }
  });
  setScore(newScore);
  setSubmitted(true);

  if (user) {
    const userRef = doc(db, "users", user.uid);

    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          score: newScore,
          timestamp: new Date(),
        });
      } else {
        await setDoc(userRef, {
          name: user.displayName || user.email,
          score: newScore,
          timestamp: new Date(),
        });
      }
    } catch (err) {
      console.error("Error saving score:", err);
    }
  }
};


  const paginatedQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };


  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Please Sign In</h2>
          <p className="text-lg mb-4 text-center dark:text-white">
            You need to be signed in to take the quiz.
          </p>
          <button
            className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center w-full"
            onClick={HandleLinkSignIn}
          >
            Sign Out
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 py-8 px-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-slate-700 dark:text-white z-50 shadow-md mb-10">
        <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Frontend Quiz</h1>
          <div className="text-lg font-medium">⏱️ {formatTime(timer)}</div>
        </div>
        {!submitted && (
          <div className="max-w-3xl mx-auto px-4 pb-2">
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    (Object.keys(answers).length / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800  p-6 rounded-xl shadow-lg mt-20">
        {!submitted && (
          <>
            {/* Questions */}
            {paginatedQuestions.map((q) => (
              <div key={q.id} className="mb-8">
                <h2 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">
                  {q.id}. {q.question}
                </h2>
                <div className="space-y-2">
                  {q.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 dark:hover:bg-purple-900 rounded-lg p-2 hover:bg-purple-50 cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        className="accent-purple-600"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleOptionChange(q.id, option)}
                        required
                      />
                      <span className="dark:text-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentPage > 1 && (
                <button
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                  onClick={prevPage}
                >
                  Previous
                </button>
              )}
              <button
                className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
                onClick={nextPage}
              >
                {currentPage === totalPages ? "Submit" : "Next"}
              </button>
            </div>
          </>
        )}

        {/* Score & Answers */}
        {submitted && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-3 text-purple-700">
              Your Score: {score}/20
            </h2>
            <p
              className={`text-lg font-semibold ${
                score >= 14 ? "text-green-600" : "text-red-600"
              }`}
            >
              {score >= 14 ? "You Passed! 🎉" : "You Failed. Try Again!"}
            </p>

            <div className="mt-6 space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <h3 className="font-medium mb-2">
                    {q.id}. {q.question}
                  </h3>
                  {q.options.map((option, i) => {
                    const isCorrect = option === q.answer;
                    const isUserAnswer = answers[q.id] === option;

                    const textColor = isCorrect
                      ? "text-green-600 font-semibold"
                      : isUserAnswer
                      ? "text-red-600 font-semibold"
                      : "text-gray-700";

                    return (
                      <p key={i} className={`${textColor} ml-2`}>
                        • {option}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>

            <button
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition mt-10 mr-10"
              onClick={HandleLinkLeaderboard}
            >
              See Leader Board
            </button>
            <button
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition mt-10"
              onClick={HandleLink}
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
