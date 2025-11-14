export async function getQuizInfo(quizID, token) {
    const res = await fetch(`http://localhost:3000/quiz/${quizID}`, {
        method: "GET",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
    });

    if (!res.ok) {
        throw new Error("Failed to get Quiz Info");
    }

    return await res.json();            // contains QuizTitle and Quiz description
};