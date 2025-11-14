import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../../components/questionCard";
import { SubmitQuizAnswers } from "../../helpers/submitQuizAnswers";
import { createAttempt } from "../../helpers/createAttempt";
import { SubmitAttempt } from "../../helpers/submitAttempt";

function AttemptQuizPage (){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const {quizID} = useParams();
    const navigate = useNavigate();
    const [attemptID, setAttemptID] = useState(0);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        console.log("Creating Atempt...");
        let isCreated = false;
        const fetchQuestions = async() => {
            if (isCreated) 
                return;
            isCreated = true;
            const URL = `http://localhost:3000/quiz/${quizID}/question`;
            const token = localStorage.getItem("token");
            try
            {
                //Creating attempt
                const attData = await createAttempt(quizID, token);
                setAttemptID(attData.attemptID);

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

    const handleNext = async() => {
        try
        {
            const token= localStorage.getItem("token");
            const currentQuestion = questions[currentIndex];
            const SelectedOptionID = answers[currentQuestion?.QuestionID];
            if(!SelectedOptionID)
            {
                alert("Must Select an option!");
                return;
            }
            await SubmitQuizAnswers(quizID, attemptID, currentQuestion.QuestionID, SelectedOptionID, token);
            setCurrentIndex(currentIndex + 1);
        }
        catch(err)
        {
            setError(err.message);
        }
    }
    const handlePrev = async() => 
    {
        setCurrentIndex(currentIndex - 1);
    }

    const handleFinish = async() => {
        try
        {
            //Save the last answer
            const token = localStorage.getItem("token");
            const currentQuestion = questions[currentIndex];
            const SelectedOptionID = answers[currentQuestion?.QuestionID];
            if(!SelectedOptionID)
            {
                alert("Must Select an option!");
                return;
            }
            await SubmitQuizAnswers(quizID, attemptID, currentQuestion.QuestionID, SelectedOptionID, token);

            await SubmitAttempt (quizID, attemptID, token);
            alert("Quiz Submitted Successfully");
            navigate('/quiz');
        }
        catch(err)
        {
            setError(err.message);
        }
    }

    if(loading)
    {
        return (<p className="text-left mt-6">Loading Questions</p>);
    }
    if(error)
    {
        return (<p className="text-red-600 text-center mt-6">Failed to load Questions</p>);
    }

    //Answers is a structure of the form (2: 45) (QuestionID : OptionID)
    const currentQuestion = questions[currentIndex];
    const selectedOption = answers[currentQuestion?.QuestionID];
    const handleSelectOption = (OptionID) => {
        const currentQuestion = questions[currentIndex];
        setAnswers({...answers, [currentQuestion.QuestionID]:OptionID});
    };
    return(
        <div className="flex flex-col bg-gray-100 min-h-screen p-8">
            <h1 className="text-4xl text-center font-bold mb-6">Attempting Quiz</h1>
            {currentQuestion &&(
                <QuestionCard key={currentQuestion.QuestionID} 
                question={{QuestionID: currentQuestion.QuestionID, QuestionText: currentQuestion.QuestionText, QuestionType: currentQuestion.QuestionType, Options:currentQuestion.Options}}
                selectedOption={selectedOption} onSelectOption= {handleSelectOption} mode={"attempt"} />
            )}
            <div className="flex flex-row justify-between p-8 mt-8">
                {currentIndex > 0 && (
                    <button onClick={handlePrev} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                        Previous
                    </button>
                )}

                {currentIndex < (questions.length - 1) ? (
                    <button onClick={handleNext} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                        Next
                    </button>
                ) : (
                    <button onClick={handleFinish} className="px-10 py-4 text-xl rounded-lg text-white bg-blue-500">
                        Finish
                    </button>)
            }
            </div>
        </div>
    );
};

export default AttemptQuizPage;