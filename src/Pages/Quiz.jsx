import './Quiz.css';
import Container from "react-bootstrap/Container";

export default function Quiz()
{
    return (
        <Container className="quiz-container">
            <Container className='quiz'>
                <h1 className='heading'>Quizzy Time</h1>
                <hr className='divider'/>
                <h2>Q1. Example quiz question here</h2>
                <h3>Answer 1</h3>
                <h3>Answer 2</h3>
                <h3>Answer 3</h3>
                <h3>Answer 4</h3>
            </Container>
        </Container>
    )
}
