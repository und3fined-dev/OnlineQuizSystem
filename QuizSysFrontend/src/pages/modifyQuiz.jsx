import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizInfo } from "../../helpers/getQuizInfo";

function ModifyQuizPage () {
    const API_URL =import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false);
    const [QuizTitle, setQuizTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [error, setError] = useState("");
    const {quizID} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem("token");
                const resQuiz = await getQuizInfo(quizID, token);
                setQuizTitle(resQuiz[0].QuizTitle);
                setDescription(resQuiz[0].Description);
            } 
            catch (err) {
                setError(err.message);
            }
        };
        fetchQuiz();
    }, [quizID]);

    const modifyQuiz = async(e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        const QuizURL = `${API_URL}quiz/${quizID}`;
        const body = {QuizTitle, Description};
        try
        {   
            const res = await fetch(QuizURL, {
                method: "PUT",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(body)
            })
            const data = await res.json();
            if(!res.ok)
            {
                throw new Error ("Failed to modify quiz");
            }
            navigate("/quiz/tch");
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

    const getQuizQuestions = async() => {
        const token = localStorage.getItem("token");
        const QuestURL = `${API_URL}quiz/${quizID}/question`;
        try
        {   
            const res = await fetch(QuestURL, {
                method: "GET",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            })
            const data = await res.json();
            if(!res.ok)
            {
                throw new Error ("Failed to get Questions");
            }
            const questID = data[0].QuestionID;
            navigate(`/quiz/tch/${quizID}/modifyQuiz/question/${questID}`);
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
            <h1 className="text-3xl font-bold text-center mb-6">Modify Quiz</h1>

            {/* Checking error */}
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <form onSubmit={modifyQuiz} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium mb-2">Quiz Title</label>
                    <input type="text" value={QuizTitle || ""} onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label className="block text-lg font-medium mb-2">Quiz Description</label>
                    <textarea value={Description || ""} onChange={(e) => setDescription(e.target.value)} 
                    rows="4" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="flex justify-between">
                    <button type="button" onClick={() => navigate("/quiz/tch")} className="px-6 py-3 rounded-lg border text-gray-600 hover:bg-gray-100" >
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700" >
                        Modify Quiz
                    </button>
                    <button type="button" onClick={getQuizQuestions}  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700" >
                        Modify Questions
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default ModifyQuizPage;