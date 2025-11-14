import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function AuthPage () {
    const [isLogin, setIsLogin] = useState(true);                       //things that can change (default is true => login page)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("Student");

    const navigate = useNavigate();

    //Submit handler
    const handleSubmit = async(e) => {
        e.preventDefault();

        const url = isLogin ? "http://localhost:3000/auth/login" : "http://localhost:3000/auth/register";
        const body = {name, email, password, role};

        try{
            const res = await fetch (url, {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(body),
            });
            const data = await res.json();
            console.log("Response: ", data);

            if (res.ok)
            {
                setRole(data.role);
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                if(data.role == "Student")
                    navigate("/quiz");
                else
                    navigate('/quiz/tch');
            }
            else
            {
                alert (data.message || "Something went Wrong");
            }
        }
        catch(err)
        {
            alert("Server Error");
        }
    };
    
    return (
        <div className="flex flex1 items-center justify-center min-h-screen bg-gray-100">
            <div className=" flex flex-col ">
                 <h1 className="text-4xl font-bold mb-8 text-center">
                    {"QuizBuzz"}
                </h1>
                <div className="items-center justify-center bg-white shadow-lg rounded-2xl p-8 w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        {isLogin ? "Login" : "Register"}
                    </h2> 

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin ? (
                            <div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input type = "text" placeholder="Alex Parker" value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Role</label>
                                    <select value={role} onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Student">Student</option>
                                        <option value="Teacher">Teacher</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        ) }

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type = "email" placeholder="xyz@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        <div>
                            <label className="block text-sm font-mediun mb-1">Password</label>
                            <input type = "password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        <div>
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                                {isLogin ? "Login" : "Register"}
                            </button>
                        </div>
                    </form>

                    <p  className="mt-4 text-center text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 underline">
                            {isLogin ? "Register" : "Login"}
                        </button>
                    </p>   
                </div>
            </div>
        </div>
    );
};

export default AuthPage;