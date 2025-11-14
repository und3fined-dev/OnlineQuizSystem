import React, { useState} from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddQuestions ()
{
    const [QuestionText, setQuestionText] = useState("");
    const [QuestionType, setQuestionType] = useState("MCQ");
    const [QuestionID, setQuestionID] = useState(null);
    const [Options, setOptions] = useState([""]);
    const [OptionText, setOptionText] = useState("");
    const [IsCorrect, setIsCorrect] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {quizID} = useParams();
    const navigate = useNavigate();

    const handleSaveQuestion = async() => {
        setLoading(true);
        const URL = `http://localhost:3000/quiz/${quizID}/question/create`;
        const body = {QuestionText, QuestionType};
        const token = localStorage.getItem("token");
        try
        {
            const res = await fetch (URL, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok)
            {
                throw new Error ("Failed to Add Question");
            }
            setQuestionID(data.questionID);
            alert("Question saved! Now you can add options.");

            //In case of True/False
            if (QuestionType === "TrueFalse") {
                await addFixedOptions(data.questionID);
            }
        }
        catch(err)
        {
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    };

const addFixedOptions = async (questionId) => {
    const URL = `http://localhost:3000/quiz/${quizID}/question/${questionId}/option/create`;
    const token = localStorage.getItem("token");

    const fixedOptions = ["True", "False"];

    for (const text of fixedOptions) {
        const body = { OptionText: text, IsCorrect };
        try 
        {
            const res = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) {
                setOptions((prev) => [...prev, data]);
            }
        } 
        catch (err) 
        {
            setError(err.message);        
        }
    }
};

    const handleAddOption = async () => {
        //if (!optionText.trim()) return;
        const URL = `http://localhost:3000/quiz/${quizID}/question/${QuestionID}/option/create`;
        const token = localStorage.getItem("token");
        const body = {OptionText, IsCorrect}
        try 
        {
            const res = await fetch(URL, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`,},
                body: JSON.stringify(body)
            })
            const data = await res.json();
            if (!res.ok) 
            {
                throw new Error("Failed to save option");
            }
            setOptions([...Options, data]);
            setOptionText(""); 
        }
        catch (err) 
        {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Add Question</h1>

                {error && <p className="text-red-500 text-center">{error}</p>}
                <>
                <label className="block mb-2 text-lg font-semibold">Question</label>
                <textarea value={QuestionText} onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter your question..." className="w-full p-3 border border-gray-300 rounded-lg mb-6" />

                <label className="block mb-2 text-lg font-semibold">Type</label>
                <select value={QuestionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-6" >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="TrueFalse">True / False</option>
                </select>

                <div className = "flex justify-between">
                    <button type="button" onClick={() => navigate("/quiz/tch")} className="px-6 py-3 rounded-lg border text-gray-600 hover:bg-gray-100" >
                            Cancel
                    </button>
                    <button onClick={handleSaveQuestion} disabled={loading}
                        className="px-6 py-3  text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600" >
                        {loading ? "Saving..." : "Save Question"}
                    </button>
                </div>
                </>

                <>
                <h2 className="text-lg font-semibold mb-3">Options</h2>
                {QuestionType === "MCQ" ? (
                    <>
                    <div className="flex gap-3 mb-4">
                        <input value={OptionText} onChange={(e) => setOptionText(e.target.value)} placeholder="Enter option" className="flex-1 p-3 border border-gray-300 rounded-lg" />
                        <label className="flex items-center gap-2">
                        <input type="checkbox" checked={IsCorrect} onChange={(e) => setIsCorrect(e.target.checked)} />
                            Correct
                        </label>
                        <button onClick={handleAddOption} className="px-4 py-2 bg-green-500 text-white rounded-lg" >
                            Add
                        </button>
                    </div>

                    <ul className="list-disc pl-5">
                        {Options.map((opt, idx) => (
                            <li key={idx} className="text-gray-600">
                                {opt.OptionText}
                            </li>
                        ))}
                    </ul>
                    </>
                ) : (
                    <ul className="list-disc pl-5">
                    <li>True</li>
                    <li>False</li>
                    </ul>
                )}

                <button onClick={() => { navigate("/quiz/tch") }} className="mt-6 px-8 py-3 w-full text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-600" >
                    Finish
                </button>
                </>
            </div>
        </div>
    );
}
export default AddQuestions;