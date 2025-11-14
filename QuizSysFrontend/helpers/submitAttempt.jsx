export async function SubmitAttempt (quizID, attemptID, token)
{
    const URL = `http://localhost:3000/quiz/${quizID}/attempt/${attemptID}/submit`;
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