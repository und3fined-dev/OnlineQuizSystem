export async function getQuizInfo(quizID, token) {
    const API_URL =import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${API_URL}quiz/${quizID}`, {
        method: "GET",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
    });

    if (!res.ok) {
        throw new Error("Failed to get Quiz Info");
    }

    return await res.json();            // contains QuizTitle and Quiz description
};