import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

function LandingPageStd() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async() =>{
            const URL = "http://localhost:3000/quiz"
            try
            {
                const token = localStorage.getItem("token");
                const res = await fetch (URL, {
                    method: "GET",
                    headers: {"Authorization": `Bearer ${token}`, "Content-Type": "application/json"}
                });
                const data = await res.json();
                if (!res.ok)
                {
                    throw new Error("Failed to fetch quizzes");
                }
                setQuizzes(data);
            }
            catch(err)
            {
                setError(err.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchQuizzes();
    }, []);

    if (loading)
    {
        return(<p className="text-center mt-10">Loading Quizzes...</p>);
    }
    if(error)
    {
        return(<p className="text-center text-red-500 mt-10">{error}</p>);
    }
    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen ">
            <h1 className ="text-4xl font-bold mt-6 mb-6">Available Quizzes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                {quizzes.map((quiz) => (
                    <div key = {quiz.QuizID} className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between"> 
                        <div>
                            <h2 className="text-xl font-semibold mb-2">{quiz.QuizTitle}</h2>                           
                            <p className="text-gray-600 mb-4">{quiz.Description}</p>  
                        </div>
                        <div className="flex flex-row justify-between">
                            <button onClick={() => navigate(`${quiz.QuizID}/question`)}
                            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
                                Start Quiz
                            </button> 
                            <button onClick={() => navigate(`${quiz.QuizID}/attempt`)}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                                View Attempts
                            </button> 
                        </div>                     
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPageStd;