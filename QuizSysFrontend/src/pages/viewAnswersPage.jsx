import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../../components/questionCard";

//Fetching answers on teh basis of questions from Answers table
function ViewAnswersPage () {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const {quizID, attemptID} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnswers = async() => {
            const URL = `http://localhost:3000/quiz/${quizID}/attempt/${attemptID}/answer`;      
            try
            {
                const token = localStorage.getItem("token");
                const res = await fetch (URL, {
                    method: "GET",
                    headers: {"Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
                })
                const data = await res.json();
                if (!res.ok)
                {
                    throw new Error("Failed to fetch Answers");
                }
                setAnswers(data);
            }
            catch(err)
            {
                setError(err.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchAnswers();
    }, [quizID, attemptID]);

    const handleFinish = async() => 
    {
        const role = localStorage.getItem("role");
        if (role == "Student")
        {
            navigate(`/quiz/${quizID}/attempt`);
        }
        else if (role == "Teacher")
        {
            navigate(`/quiz/tch/${quizID}/attempt`);
        }
    };

    if(loading)
    {
       return (<p className="text-center-xl mt-8">Loading Answers...</p> );
    }
    if(error)
    {
        return (<p className="text-center text-red-600 mt-8" >{error}</p>);
    }
    const currentAnswer = answers[currentIndex];
    return(
        <div className="flex flex-col min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl text-center font-bold mb-6 ">Viewing Attempt</h1>
            {currentAnswer && (
                <QuestionCard key = {currentAnswer.AnswerID} 
                question ={{QuestionID: currentAnswer.QuestionID, QuestionText: currentAnswer.QuestionText, QuestionType: currentAnswer.QuestionType, Options: currentAnswer.Options}} 
                selectedOption={currentAnswer.SelectedOptionID} onSelectOption={() => {}} mode="review" />
            )}
            <div className="flex flex-row justify-between p-8 mt-8">
                {currentIndex > 0 && (
                    <button onClick={() => setCurrentIndex(currentIndex - 1)} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                        Previous
                    </button>
                )}

                <button onClick={handleFinish} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                    Finish
                </button>

                {currentIndex < (answers.length - 1) && (
                    <button onClick={() => setCurrentIndex(currentIndex + 1)} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                        Next
                    </button>
                )}
            </div>
        </div>

    );
}

export default ViewAnswersPage;