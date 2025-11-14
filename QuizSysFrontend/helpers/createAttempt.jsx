export async function createAttempt(quizID, token) {
    const body = {quizID};
    const res = await fetch(`http://localhost:3000/quiz/${quizID}/attempt/create`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        throw new Error("Failed to create attempt");
    }

    const data= await res.json();            // contains AttemptID
    return data;
};