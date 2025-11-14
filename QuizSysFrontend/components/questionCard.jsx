import React from "react";

function QuestionCard ({question, selectedOption, onSelectOption, mode}) {
    
    return(
        <div className="bg-white rounded-2xl shadow-md w-full max-w-6xl">
            <h2 className="text-lg font-semibold p-8 mt-4 ">{question.QuestionText}</h2>
            <div className="space-y-3 gap-6 p-6">
                {question.Options.map((opt) => {
                    if(opt) 
                    {
                        const isSelected = (selectedOption === opt.OptionID);
                        return(
                            <button key={opt.OptionID} onClick={() => mode === "attempt" && onSelectOption(opt.OptionID)}
                            className={`w-full p-8 mb-4 text-left  rounded-lg border transition ${isSelected ? "bg-blue-500 text-white": "bg-gray-100"}
                            ${mode == "review" ? "cursor-default" : "cursor-pointer"}`}>
                                {opt.OptionText}
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    )
}

export default QuestionCard;