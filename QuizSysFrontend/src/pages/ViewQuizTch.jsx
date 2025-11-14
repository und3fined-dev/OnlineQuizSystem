import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../../components/questionCard";

function ViewQuizTch (){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const {quizID} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async() => {
            const URL = `http://localhost:3000/quiz/${quizID}/question`;
            const token = localStorage.getItem("token");
            try
            {
                //Fetching questions
                const res = await fetch(URL, {
                    method: "GET",
                    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
                })
                const data = await res.json();
                if(!res.ok)
                {
                    throw new Error("Failed to fetch Questions");
                }
                setQuestions(data);
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
        fetchQuestions();
    }, [quizID]);

    if(loading)
    {
        return (<p className="text-left mt-6">Loading Questions</p>);
    }
    if(error)
    {
        return (<p className="text-red-600 text-center mt-6">Failed to load Questions</p>);
    }

    const currentQuestion = questions[currentIndex];
    return(
        <div className="flex flex-col bg-gray-100 min-h-screen p-8">
            <h1 className="text-4xl text-center font-bold mb-6">Reviewing Quiz</h1>
            {currentQuestion &&(
                <QuestionCard key={currentQuestion.QuestionID} 
                question={{QuestionID: currentQuestion.QuestionID, QuestionText: currentQuestion.QuestionText, QuestionType: currentQuestion.QuestionType, Options:currentQuestion.Options}}
                selectedOption={[]} onSelectOption={() => {}} mode={"review"} />
            )}
            <div className="flex flex-row justify-between p-8 mt-8">
                {currentIndex > 0 && (
                    <button onClick={() => {setCurrentIndex(currentIndex - 1)}} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                        Previous
                    </button>
                )}

                {currentIndex < (questions.length - 1) ? (
                    <button onClick={() => {setCurrentIndex(currentIndex + 1)}} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                        Next
                    </button>
                ) : (
                    <button onClick={() => {navigate('/quiz/tch')}} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                        Finish
                    </button>)
            }
            </div>
        </div>
    );
};

export default ViewQuizTch;