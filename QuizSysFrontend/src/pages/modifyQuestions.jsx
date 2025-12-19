import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ModifyQuestions() {
  const API_URL =import.meta.env.VITE_BACKEND_URL;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [QuestionText, setQuestionText] = useState("");
  const [QuestionType, setQuestionType] = useState("MCQ");
  const [Options, setOptions] = useState([]);
  const [OptionText, setOptionText] = useState("");
  const [IsCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { quizID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        // use whichever endpoint you have that returns an array of questions
        const URL = `${API_URL}quiz/${quizID}/question`;
        const res = await fetch(URL, {
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch questions");

        // Normalize: ensure every question has an Options array (never null)
        const normalized = (Array.isArray(data) ? data : []).map(q => ({
          ...q,
          Options: Array.isArray(q.Options) ? q.Options : []
        }));

        setQuestions(normalized);

        if (normalized.length > 0) {
          loadQuestion(normalized[0]);
          setCurrentIndex(0);
        }
      } catch (err) {
        setError(err.message || "Server error");
      }
    };
    fetchQuestions();
  }, [quizID]);

  const loadQuestion = (q) => {
    setQuestionText(q.QuestionText ?? "");
    setQuestionType(q.QuestionType ?? "MCQ");
    setOptions(Array.isArray(q.Options) ? q.Options : []);
    setOptionText("");
    setIsCorrect(false);
  };

  const handleSaveQuestion = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const question = questions[currentIndex];
      const URL = `${API_URL}quiz/${quizID}/question/${question.QuestionID}`;
      const body = { QuestionText, QuestionType };

      const res = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update question");

      // update local questions state so UI stays consistent
      const updated = [...questions];
      updated[currentIndex] = {
        ...updated[currentIndex],
        QuestionText,
        QuestionType,
        Options,
      };
      setQuestions(updated);
      alert("Question updated!");
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = async () => {
    if (!OptionText.trim()) return setError("Option text cannot be empty");
    const question = questions[currentIndex];
    const URL = `${API_URL}$quiz/{quizID}/question/${question.QuestionID}/option/create`;
    const token = localStorage.getItem("token");
    const body = { OptionText, IsCorrect };

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save option");

      // append to Options (ensure it's an array)
      setOptions(prev => [...(Array.isArray(prev) ? prev : []), data]);
      // also update questions array so navigation keeps it
      const updated = [...questions];
      updated[currentIndex] = {
        ...updated[currentIndex],
        Options: [...(updated[currentIndex].Options || []), data],
      };
      setQuestions(updated);

      setOptionText("");
      setIsCorrect(false);
      setError("");
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

    const handleUpdateOption = async (questionId) => {
    if (!Options || Options.length === 0) return; // nothing to update

    const token = localStorage.getItem("token");

    try {
        for (const opt of Options) {
        if (!opt || !opt.OptionID) continue; // skip null or new options without ID

        const URL = `${API_URL}quiz/${quizID}/question/${questionId}/option/${opt.OptionID}`;
        const body = {
            OptionText: opt.OptionText ?? "",
            IsCorrect: opt.IsCorrect ?? false,
        };

        const res = await fetch(URL, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`Failed to update option ${opt.OptionID}`);
        }
        }

        console.log("Options updated successfully");
    } catch (err) {
        console.error("Error updating options:", err);
        setError(err.message);
    }
    };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      handleUpdateOption(questions[currentIndex].QuestionID);
      const nextIndex = currentIndex + 1;
      loadQuestion(questions[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      loadQuestion(questions[prevIndex]);
      setCurrentIndex(prevIndex);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Modify Questions</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {questions.length > 0 ? (
          <>
            <label className="block mb-2 text-lg font-semibold">Question</label>
            <textarea
              value={QuestionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-6"
            />

            <label className="block mb-2 text-lg font-semibold">Type</label>
            <select
              value={QuestionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-6"
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="TrueFalse">True / False</option>
            </select>

            <button
              onClick={handleSaveQuestion}
              disabled={loading}
              className="px-8 py-3 w-full text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600 mb-6"
            >
              {loading ? "Saving..." : "Save Question"}
            </button>

            <h2 className="text-lg font-semibold mb-3">Options</h2>

            {QuestionType === "MCQ" ? (
            <>
                <div className="flex gap-3 mb-4">
                <input
                    value={OptionText}
                    onChange={(e) => setOptionText(e.target.value)}
                    placeholder="Enter new option"
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                />
                <label className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={IsCorrect}
                    onChange={(e) => setIsCorrect(e.target.checked)}
                    />
                    Correct
                </label>
                <button
                    onClick={handleAddOption}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                    Add
                </button>
                </div>

                <ul className="list-disc pl-5">
                {Options && Options.length > 0 ? (
                    Options.filter(opt => opt !== null && opt !== undefined).map((opt, idx) => (
                    <li key={idx} className="mb-3">
                        <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={opt?.OptionText ?? ""}
                            onChange={(e) => {
                            const newOptions = [...Options];
                            if (!newOptions[idx]) newOptions[idx] = {};
                            newOptions[idx].OptionText = e.target.value;
                            setOptions(newOptions);
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                        <label className="flex items-center gap-2">
                            <input
                            type="checkbox"
                            checked={opt?.IsCorrect ?? false}
                            onChange={(e) => {
                                const newOptions = [...Options];
                                if (!newOptions[idx]) newOptions[idx] = {};
                                newOptions[idx].IsCorrect = e.target.checked;
                                setOptions(newOptions);
                            }}
                            />
                            Correct
                        </label>
                        </div>
                    </li>
                    ))
                ) : (
                    <p className="text-gray-500">No options available</p>
                )}
                </ul>
            </>
            ) : (
            <ul className="list-disc pl-5">
                <li>True</li>
                <li>False</li>
            </ul>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="px-6 py-3 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={goNext}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => navigate("/quiz/tch")}
                  className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Finish
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-center">No questions found for this quiz.</p>
        )}
      </div>
    </div>
  );
}

export default ModifyQuestions;
