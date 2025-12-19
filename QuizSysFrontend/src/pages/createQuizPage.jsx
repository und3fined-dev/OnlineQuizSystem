import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function CreateQuizPage () {
    const API_URL =import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false);
    const [QuizTitle, setQuizTitle] = useState([]);
    const [Description, setDescription] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const createQuiz = async(e) => {
        e.preventDefault();
        setLoading(true);
        const QuizURL = `${API_URL}quiz/create`;
        const body = {QuizTitle, Description};
        const token = localStorage.getItem("token");
        try
        {   
            const res = await fetch(QuizURL, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(body)
            })
            const data = await res.json();
            if(!res.ok)
            {
                throw new Error ("Failed to create quiz");
            }
            navigate(`/quiz/tch`);
        }
        catch(err)
        {
            setError(err.message);
        }
        finally
        {
            setLoading(false);
        }
    }
   
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Create New Quiz</h1>

            {/* Checking error */}
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <form onSubmit={createQuiz} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium mb-2">Quiz Title</label>
                    <input type="text" value={QuizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Enter quiz title"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-2">Quiz Description</label>
                    <textarea value={Description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter quiz Description"
                    rows="4" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>

                <div className="flex justify-between">
                    <button type="button" onClick={() => navigate("/quiz/tch")} className="px-6 py-3 rounded-lg border text-gray-600 hover:bg-gray-100" >
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700" >
                        Create Quiz
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default CreateQuizPage;