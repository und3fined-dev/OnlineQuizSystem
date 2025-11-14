import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import LandingPageStd from "./pages/landingPageStd";
import ViewAttemptsPage from "./pages/viewAttemptspage";
import ViewAnswersPage from "./pages/viewAnswersPage";
import AttemptQuizPage from "./pages/attemptQuizPage";

import LandingPageTch from "./pages/landingPageTch";
import ViewQuizTch from "./pages/ViewQuizTch";
import ViewAttemptsTch from "./pages/viewAttemptsTch";
import CreateQuizPage from "./pages/createQuizPage";
import AddQuestions from "./pages/addQuestions"; 
import ModifyQuizPage from "./pages/modifyQuiz";
import ModifyQuestions from "./pages/modifyQuestions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element= {<AuthPage/>} />
        <Route path="/quiz" element = {<LandingPageStd/>} />
        <Route path='/quiz/:quizID/attempt' element= {< ViewAttemptsPage />} />
        <Route path='/quiz/:quizID/attempt/:attemptID/answer' element={<ViewAnswersPage />}/>
        <Route path='/quiz/:quizID/question' element={<AttemptQuizPage />} />

        <Route path="/quiz/tch" element = {<LandingPageTch/>} />
        <Route path='/quiz/tch/:quizID/question' element={<ViewQuizTch />} />
        <Route path='/quiz/tch/:quizID/attempt' element= {< ViewAttemptsTch />} />
        <Route path='/quiz/tch/create' element= {< CreateQuizPage />} />
        <Route path='/quiz/tch/:quizID/addQuestion' element= {< AddQuestions />} />
        <Route path='/quiz/tch/:quizID/modifyQuiz' element= {< ModifyQuizPage />} />
        <Route path='/quiz/tch/:quizID/modifyQuiz/question/:questionID' element= {< ModifyQuestions />} />

      </Routes>
    </Router>
  );
};

export default App; 