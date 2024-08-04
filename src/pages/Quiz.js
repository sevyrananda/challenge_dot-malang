import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, ListGroup, ProgressBar, Button, Accordion } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Quiz(props) {
    const navigate = useNavigate();
    const triviaData = props.data || [];
    const [showResult, setShowResult] = useState(false);
    const [allPossibleAnswers, setAllPossibleAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerCorrect, setAnswerCorrect] = useState(false);
    const [result, setResult] = useState({ correctAnswer: 0, wrongAnswer: 0, totalAnswer: 0 });
    const [timer, setTimer] = useState("02:00"); // Timer awal 2 menit
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [history, setHistory] = useState([]); // Riwayat jawaban
    const Ref = useRef(null);
    const [deadline, setDeadline] = useState(new Date(new Date().getTime() + 120000)); // Deadline 2 menit

    useEffect(() => {
        // Memulai timer dan mempersiapkan pertanyaan jika triviaData tersedia
        if (triviaData.length > 0) {
            combineAllAnswers();
            if (!showResult) {
                if (Ref.current) clearInterval(Ref.current);
                setDeadline(new Date(new Date().getTime() + 120000)); // Set deadline ke 2 menit
                Ref.current = setInterval(() => startTimer(), 1000);
            }
        } else {
            navigate("/"); // Navigasi jika tidak ada data trivia
        }
        return () => {
            if (Ref.current) clearInterval(Ref.current); // Bersihkan interval saat komponen di-unmount
        };
    }, [triviaData, showResult]);

    function combineAllAnswers() {
        // Menggabungkan dan mengacak semua jawaban termasuk jawaban yang benar
        let allAnswers = [];
        let correctAnswer = triviaData[currentQuestion]?.correct_answer;
        triviaData[currentQuestion]?.incorrect_answers.forEach((answer) => { allAnswers.push(answer) });
        allAnswers.push(correctAnswer);
        allAnswers.sort(() => Math.random() - 0.5);
        setAllPossibleAnswers(allAnswers);
    }

    function removeCharacters(question) {
        // Menghapus karakter HTML dari teks pertanyaan
        if (!question) return "";
        return question.replace(/(&quot\;)/g, "\"")
                       .replace(/(&rsquo\;)/g, "\"")
                       .replace(/(&#039\;)/g, "\'")
                       .replace(/(&amp\;)/g, "&");
    }

    function clickAnswer(answer) {
        // Menangani klik jawaban dan mengupdate hasil serta riwayat
        const correctAnswer = triviaData[currentQuestion]?.correct_answer;
        const isCorrect = answer === correctAnswer;
        setSelectedAnswer(answer);
        setAnswerCorrect(isCorrect);
        setResult(prevResult => ({
            correctAnswer: isCorrect ? prevResult.correctAnswer + 1 : prevResult.correctAnswer,
            wrongAnswer: !isCorrect ? prevResult.wrongAnswer + 1 : prevResult.wrongAnswer,
            totalAnswer: prevResult.totalAnswer + 1
        }));
        setAnsweredQuestions(prev => prev + 1); // Update jumlah soal terjawab

        // Simpan riwayat jawaban
        setHistory(prevHistory => [
            ...prevHistory,
            {
                question: triviaData[currentQuestion]?.question,
                selectedAnswer: answer,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect
            }
        ]);

        setTimeout(() => {
            if (currentQuestion < triviaData.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                combineAllAnswers();
                setSelectedAnswer(null);
            } else {
                setShowResult(true); // Tampilkan hasil jika semua soal telah dijawab
            }
        }, 1000); // Delay sebelum pindah ke pertanyaan berikutnya
    }

    const getTimeRemaining = () => {
        // Menghitung waktu yang tersisa pada timer
        const total = deadline - new Date();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return { total, minutes, seconds };
    }

    const startTimer = () => {
        // Memperbarui timer setiap detik
        const { total, minutes, seconds } = getTimeRemaining();
        if (total >= 0) {
            setTimer((minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds));
        } else {
            setShowResult(true); // Tampilkan hasil jika waktu habis
            clearInterval(Ref.current);
        }
    }

    const getProgressBarNow = () => {
        // Menghitung persentase progress bar berdasarkan waktu tersisa
        const { total } = getTimeRemaining();
        return (total / 120000) * 100; // Perbarui untuk 2 menit
    }

    const handleRetry = () => {
        // Mengatur ulang kuis untuk percobaan berikutnya
        setCurrentQuestion(0);
        setResult({ correctAnswer: 0, wrongAnswer: 0, totalAnswer: 0 });
        setAnsweredQuestions(0); // Reset jumlah soal terjawab
        setSelectedAnswer(null); // Pastikan selectedAnswer dihapus
        setHistory([]); // Reset riwayat jawaban
        setShowResult(false);
        combineAllAnswers();
        setDeadline(new Date(new Date().getTime() + 120000)); // Reset deadline ke 2 menit
        if (Ref.current) clearInterval(Ref.current);
        Ref.current = setInterval(() => startTimer(), 1000);
    }

    const handleLogout = () => {
        // Menangani logout dan menghapus item dari localStorage
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('loggedIn');
                navigate("/");
            }
        });
    }

    return (
        <Container className="mt-5">
            {!showResult ? (
                <>
                    <Card>
                        <Card.Header>
                            <h2>Question {currentQuestion + 1} of {triviaData.length}</h2>
                        </Card.Header>
                        <Card.Body>
                            <h3>{removeCharacters(triviaData[currentQuestion]?.question)}</h3>
                            <ListGroup variant="flush">
                                {allPossibleAnswers.map((answer, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        action
                                        onClick={() => clickAnswer(answer)}
                                        className={answer === selectedAnswer ? (answer === triviaData[currentQuestion]?.correct_answer
                                            ? 'bg-success text-white'
                                            : 'bg-danger text-white') : ''}
                                    >
                                        {removeCharacters(answer)}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <ProgressBar className="mt-3" now={getProgressBarNow()} label={timer} />
                            <div className="mt-3 text-center">
                                <p>Jumlah Soal Terjawab: {answeredQuestions}</p> {/* Menampilkan jumlah soal terjawab */}
                                <p>Total Soal: {triviaData.length}</p> {/* Menampilkan total soal */}
                            </div>
                        </Card.Body>
                    </Card>
                </>
            ) : (
                <Card className="text-center">
                    <Card.Header>
                        <h1>Results</h1>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>Your Results</Card.Title>
                        <Card.Text>
                            <p>Correct Answers: {result.correctAnswer}</p>
                            <p>Wrong Answers: {result.wrongAnswer}</p>
                            <p>Total Questions: {result.totalAnswer}</p>
                        </Card.Text>
                        <Button variant="primary" onClick={handleRetry}>Retry</Button>
                        <Button variant="outline-danger" className="ms-3" onClick={handleLogout}>Logout</Button>
                        <Accordion className="mt-4">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Question History</Accordion.Header>
                                <Accordion.Body>
    {history.length === 0 ? (
        <p>No questions answered yet.</p>
    ) : (
        <ListGroup>
            {history.map((item, index) => (
                <ListGroup.Item key={index}>
                    <h5>{removeCharacters(item.question)}</h5>
                    <p>Selected Answer: {removeCharacters(item.selectedAnswer)}</p>
                    <p>Correct Answer: {removeCharacters(item.correctAnswer)}</p>
                    {item.isCorrect ? (
                        <p className="text-success">Your answer was correct.</p> // Tampilkan jika jawaban benar
                    ) : (
                        <p className="text-danger">Your answer was incorrect.</p> // Tampilkan jika jawaban salah
                    )}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )}
</Accordion.Body>

                            </Accordion.Item>
                        </Accordion>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default Quiz;
