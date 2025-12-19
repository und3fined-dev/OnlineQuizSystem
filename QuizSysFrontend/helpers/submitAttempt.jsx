export async function SubmitAttempt (quizID, attemptID, token)
{
    const API_URL =import.meta.env.VITE_BACKEND_URL;
    const URL = `${API_URL}quiz/${quizID}/attempt/${attemptID}/submit`;
    const res = await fetch (URL, {
        method: "PATCH", 
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
    })

    if (!res.ok) 
    {
        throw new Error("Failed to save attempt");
    }

    return await res.json();
}