import React, { useState, useEffect } from "react";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
   const [triviaData, setTriviaData] = useState([]);
   const fetchData = async () => {
      const resp = await fetch("https://opentdb.com/api.php?amount=5&category=27&difficulty=easy&type=boolean");
      const data = await resp.json();
      setTriviaData(data.results);
   };

   useEffect(() => {
      fetchData();
   }, []);

   return (
      <Router>
         <main className="flex justify-center min-h-screen bg-zinc-950 text-zinc-50 py-16">
            <Routes>
               <Route path="/" element={<Login />} />
               <Route path="/welcome" element={<Welcome />} />
               <Route path="/quiz" element={<Quiz data={triviaData} />} />
            </Routes>
         </main>
      </Router>
   );
}

export default App;
