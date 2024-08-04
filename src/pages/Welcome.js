import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Card } from 'react-bootstrap';

// Ganti dengan path gambar yang sesuai
import welcomeImage from '../assets/quiz.png';

const Welcome = () => {
    const navigate = useNavigate();

    const startQuiz = () => {
        navigate("/quiz");
    };

    return (
        <Container className="mt-5 text-center">
            <Card>
                <Card.Header>
                    <h1>Welcome to the Quiz App!</h1>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Here, you can test your knowledge with a series of questions.
                        Click the button below to start the quiz.
                    </Card.Text>
                    <img
                        src={welcomeImage}
                        alt="Welcome"
                        style={{ width: '100%', maxWidth: '400px', marginBottom: '20px' }}
                    />
                </Card.Body>
                <Button variant="primary" onClick={startQuiz}>
                    Start Quiz
                </Button>
            </Card>
        </Container>
    );
};

export default Welcome;
