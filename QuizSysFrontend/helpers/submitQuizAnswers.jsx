export async function SubmitQuizAnswers(quizID, attemptID, questionID, selectedOptionID, token) 
{
    const API_URL =import.meta.env.VITE_BACKEND_URL;
    const URL = `${API_URL}quiz/${quizID}/attempt/${attemptID}/question/${questionID}/answer/submit`
    const body = {selectedOptionID};
    const res = await fetch(URL, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify(body),
    });

    if (!res.ok) 
    {
        throw new Error("Failed to save answers");
    }
    return await res.json();
}