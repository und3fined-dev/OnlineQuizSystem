import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function ViewAttemptsTch() {
    const API_URL =import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState([]);
    const {quizID} = useParams();
    const navigate = useNavigate();

    useEffect(() => { 
        const fetchAttempts = async() => {
            const URL = `${API_URL}quiz/${quizID}/attempt`;

            try{
                const token = localStorage.getItem("token");
                const res = await fetch (URL, {
                    method: "GET",
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })
                const data = await res.json();
                if (!res.ok)
                {
                    throw new Error("Failed to fetch Attempts");
                }
                setAttempts(data);
                console.log("attempts", data);
            }
            catch(err){
                setError(err.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchAttempts();
    }, [])

    if(loading)
    {
       return (<p className="text-center mt-10 ">Loading Attempts...</p>);
    }
    if(error)
    {
        return (<p className="text-center text-red-600 mt-6">{error}</p>);
    }
    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen">
            <h1 className="text-4xl text-center font-bold mt-8">
                Submitted Attempts
            </h1>

            <div className="w-full flex justify-between mb-6 px-10">
                <button onClick={() => navigate(`/quiz/tch`)} className="px-6 py-2 text-xl rounded-lg text-white bg-blue-500 hover:bg-blue-600">
                    Back
                </button>

                <div className="bg-gray-300 shadow-lg text-xl py-2 px-6">
                    <h2>Best Score: {attempts[0].BestScore}</h2>
                </div> 
            </div>

            <div className="grid grid-cols-1 items-center justify-center  gap-6 w-full max-w-8xl px-6">
                {attempts.map((attempt, index) => (
                    <div key={attempt.AttemptID} className="bg-white p-6 rounded-2xl shadow-md flex flex-row items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Attempt {index + 1}
                            </h2>
                            <p className="text-gray-600">Score: {attempt.Score}</p>
                        </div>
                        <p className="text-xl font-semibold">UserID: {attempt.UserID}</p>
                        <button onClick={() => navigate(`/quiz/${quizID}/attempt/${attempt.AttemptID}/answer`)} className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
                            View Answers
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewAttemptsTch;