import './Quiz.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';


export default function Quiz()
{
    // variable setup
    const quizUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // function to combine incorrect and correct answer into one
    async function combineAnswers(incorrectAnswers, correctAnswer)
    {
        let allAnswers = [...incorrectAnswers];
        allAnswers.push(correctAnswer);
        allAnswers.sort(() => Math.random() - 0.5);
        return allAnswers;
    }

    // fetch data from api and set it into a state
    useEffect(() =>
    {
        const fetchData = async () => 
        {
            setLoading(true);
            try 
            {
                const response = await fetch(quizUrl);
                const quizData = await response.json();
                
                // processed the raw data and return a data with combined answers
                const processedData = await Promise.all(quizData.results.map(async (question) =>
                {
                    question.answers = await combineAnswers(question.incorrect_answers, question.correct_answer);
                    return question;
                }));

                setQuiz(processedData);
            }
            catch (error)
            {
                console.error('Error fetching data: ', error);
            }
            finally
            {
                setLoading(false);
            }
        };
            
        fetchData();
    }, []);

    // converts html to regular characters
    function removeCharacters(question) 
    {
        return question
            .replace(/&quot;/g, "\"")
            .replace(/&rsquo;/g, "'")
            .replace(/&#039;/g, "'")
            .replace(/&eacute;/g, "é")
            .replace(/&amp;/g, "&");
    }

    //handles prev and next question button function
    function handlePrevQuestion()
    {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
    function handleNextQuestion()
    {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, quiz.length - 1));
    }

    return (
        <Container className="quiz-container">
            <Container className='quiz'>
                <h1 className='heading'>Quizzy Time</h1>
                <hr className='divider'/>      
                {loading ? 
                (
                    <Container>
                        <h1>Loading...</h1>
                        <Spinner animation='border' variant='light'/>
                    </Container>
                ) : 
                (
                    quiz && quiz.length > 0 ? 
                    (
                        <>
                            <p>Category - {quiz[currentQuestionIndex].category} | Difficulty: {quiz[currentQuestionIndex].difficulty}</p>
                            <Row className='align-items-center'>
                                <Col xs={3} sm={2}>
                                    <p>Progress:</p>
                                </Col>
                                <Col xs={9} sm={10}>
                                    <ProgressBar now={(currentQuestionIndex + 1) * 20} label={`${currentQuestionIndex + 1}/${quiz.length}`}/>
                                </Col>
                            </Row>
                            <Row className='align-items-center'>
                                <Col xs={6} md={8} className='text-start'>
                                    <p>{currentQuestionIndex + 1} of {quiz.length} questions</p>
                                </Col>
                                <Col xs={6} md={4}>
                                    <Container className="d-flex justify-content-end align-items-center">
                                        <Container className="timer d-inline-flex align-items-center">
                                            <img 
                                                src="/img/timer.png"
                                                alt='timer-icon'
                                            />
                                            <span>10s</span>
                                        </Container>
                                        <Button className='add-time-btn'>
                                            <img src='/img/add.png'
                                                alt='add-more-time'
                                                width='24'
                                                height='24'
                                            />
                                        </Button>
                                    </Container>
                                </Col>
                            </Row>
                            <hr className='divider'/> 
                            <h2 className='heading'>Q. {removeCharacters(quiz[currentQuestionIndex].question)}</h2>
                            <Row className='align-items-center'>
                                <Col xs={6} className='text-end'>
                                    <p>3/3 hints remaining</p>
                                </Col>
                                <Col xs={6}>
                                    <Button className='hint-btn'>
                                        <img 
                                            src='/img/hint.png'
                                            alt='hint-icon'
                                            height='24'
                                            width='24'
                                        />
                                        <span style={{ paddingLeft: '5px' }}>Hints</span>
                                    </Button>
                                </Col>
                            </Row>
                            <Button variant='outline-light'>{quiz[currentQuestionIndex].answers[0]}</Button>{' '}
                            <Button variant='outline-light'>{quiz[currentQuestionIndex].answers[1]}</Button>{' '}
                            <Button variant='outline-light'>{quiz[currentQuestionIndex].answers[2]}</Button>{' '}
                            <Button variant='outline-light'>{quiz[currentQuestionIndex].answers[3]}</Button>{' '}
                            <hr className='divider'/>  
                            <Row className='align-items-center'>
                                <Col xs={4} className='d-flex justify-content-end'>
                                    <Button className='prev-btn' onClick={handlePrevQuestion}>
                                        <img 
                                            src='/img/prev.png'
                                            alt='prev-icon'
                                            height='24'
                                            width='24'
                                        />
                                        <span style={{ paddingLeft: '5px' }}>Prev</span>   
                                    </Button>
                                </Col>
                                <Col xs={4} className='d-flex justify-content-center'>
                                    <Button className='submit-btn'>
                                        Submit
                                    </Button>
                                </Col>
                                <Col xs={4} className='d-flex justify-content-start'>
                                    <Button className='next-btn' onClick={handleNextQuestion}>
                                        <span style={{ paddingRight: '5px' }}>Next</span>
                                        <img 
                                            src='/img/next.png'
                                            alt='next-icon'
                                            height='24'
                                            width='24'
                                        />
                                    </Button>
                                </Col>
                            </Row> 
                        </>
                    ) :
                    ( <h1>No quiz data available.</h1> )
                )}     
            </Container>               
        </Container>
    )
}
