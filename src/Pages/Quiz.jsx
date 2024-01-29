import './Quiz.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react';

export default function Quiz()
{
    // variable setup
    const quizUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [showSubmitAlert, setShowSubmitAlert] = useState(false);
    // hints
    const [showHints, setShowHints] = useState(false);
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [zeroHintAlert, setZeroHintAlert] = useState(false);
    const [hintUsedAlert, setHintUsedAlert] = useState(false);
    const [usedHints, setUsedHints] = useState({});
    // timer
    const [timer, setTimer] = useState(150);
    const timerId = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [noOfExtendTime, setNoOfExtendTime] = useState(3);
    const [zeroExtendTimeAlert, setZeroExtendTimeAlert] = useState(false);


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

    // handles prev and next question button function
    function handlePrevQuestion()
    {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setZeroHintAlert(false);
        setHintUsedAlert(false);
        setShowSubmitAlert(false);
        setZeroExtendTimeAlert(false);
    }
    function handleNextQuestion()
    {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, quiz.length - 1));
        setZeroHintAlert(false);
        setHintUsedAlert(false);
        setShowSubmitAlert(false);
        setZeroExtendTimeAlert(false);
    }

    // handles show quiz
    function handleStartQuiz()
    {
        setShowQuiz(true);
        setTimer(150);

        timerId.current = setInterval(() => 
        {
            setTimer(prevTimer =>
            {
                if (prevTimer > 0) return prevTimer - 1;
                else
                {
                    clearInterval(timerId.current);
                    setShowModal(true);
                    return 0;
                }
            });
        }, 1000);
    }

    // handles selected answers
    function handleAnswerSelection(answerIndex)
    {
        setSelectedAnswer(prevSelected =>
        ({
            ...prevSelected,
            [currentQuestionIndex]: answerIndex
        }));
    }

    // handles submit funciton
    function submitQuiz()
    {   
        if (Object.keys(selectedAnswer).length === quiz.length)
        {
            setShowResults(true);
            setShowSubmitAlert(false);
        }
        else
        {
            setShowSubmitAlert(true);
        }
    }

    // handles score calculation
    function calculateScore()
    {
        let score = 0;
        quiz.forEach((question, index) =>
        {
            if (question.correct_answer === question.answers[selectedAnswer[index]])
            {
                score += 1;
            }
        });
        
        return score;
    }
    
    // handles hint display
    function handleHint()
    {
        if (usedHints[currentQuestionIndex])
        {
            setHintUsedAlert(true);
            setShowSubmitAlert(false);
        }
        else if (hintsRemaining > 0)
        {
            setShowHints(true);
            setUsedHints({...usedHints, [currentQuestionIndex]: true });
            setHintsRemaining(hintsRemaining - 1);
            setHintUsedAlert(false);
            setZeroHintAlert(false);
        }
        else
        {
            setHintUsedAlert(false);
            setZeroHintAlert(true);
        }
    }

    // clears interval id for timer when unmount.
    useEffect(() => 
    {
        return () =>
        {
            if (timerId.current)
            {
                clearInterval(timerId.current);
            }
        };
    }, []);

    // handles view results button
    function viewResult()
    {
        setShowResults(true);
        setShowModal(false);
    }

    // handles time extension button
    function ExtendTime()
    {
        if (noOfExtendTime > 0)
        {
            setTimer(prevTimer => prevTimer + 15)
            setNoOfExtendTime(noOfExtendTime - 1);
            setZeroExtendTimeAlert(false);
        }
        else
        {
            setZeroExtendTimeAlert(true);
        }
    }

    return (
        <Container className="quiz-container">
            <Container className='quiz'>
                <h1 className='heading'>Quizzy Time</h1>
                <hr className='divider'/>      
                {loading ? 
                // loading = true, show this
                (
                    <Container>
                        <h1 style={{ paddingBottom: '1em'}}>Loading...</h1>
                        <Spinner animation='border' variant='light'/>
                    </Container>
                ) : 
                // loading = false, show this
                (   
                    showResults ?
                    // results = true, show this
                    (
                        <Container>
                            <Row>
                                <h2 style={{ paddingBottom: '1em' }}>Your quiz results</h2>                            
                            </Row>
                            {quiz.map((question, index) =>
                            (
                                <Row key={index} style={{ marginBottom: '1em' }} className='align-items-center'>
                                    <Col style={{ borderRight: '1px solid #fff' }}>
                                        <p style={{ textAlign: 'left' }}>
                                            Q{index + 1}. {removeCharacters(question.question)}
                                        </p>                         
                                    </Col>            
                                    <Col>
                                        <Row style={{ marginBottom: '5px' }}>
                                            <p>Correct Answer: {' '}
                                                <span style={{ color: '#008000' }}>
                                                    {question.correct_answer}
                                                </span>
                                            </p>
                                        </Row>
                                        <Row style={{ marginTop: '5px', borderTop: '1px solid #fff' }}>
                                            <p>Your Answer: {' '}
                                                <span style={{ color: question.answers[selectedAnswer[index]] === question.correct_answer ? '#008000' : '#ff0000' }}>
                                                    {selectedAnswer[index] !== undefined ? question.answers[selectedAnswer[index]] : 'none'}
                                                </span>
                                            </p>
                                        </Row>
                                    </Col>
                                </Row>
                            ))}
                            <hr className='divider'/>
                            <Row className='align-items-center justify-content-center'>
                                <h2 style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                                    Total Score: {calculateScore()} out of {quiz.length}
                                </h2>
                                <Button 
                                    className='another-btn'
                                    onClick={() => window.location.reload()}
                                >
                                    Start Another Quiz
                                </Button>
                            </Row>
                        </Container>
                    ) :
                    // results = false, show this
                    (
                        showQuiz ? 
                        // quiz = true, show this
                        (
                            quiz && quiz.length > 0 ? 
                            // if quiz = true and length is more than 0
                            (
                            <>
                                <p>Category - {quiz[currentQuestionIndex].category} | Difficulty: {quiz[currentQuestionIndex].difficulty}</p>
                                <p>Total of {quiz.length} questions | Timer limit: 150 Seconds</p>
                                {/* progress bar section */}
                                <Row className='align-items-center'>
                                    <Col xs={3} sm={2}>
                                        <p>Progress:</p>
                                    </Col>
                                    <Col xs={9} sm={10}>
                                        <ProgressBar now={Object.keys(selectedAnswer).length / quiz.length * 100} 
                                        label={`${Object.keys(selectedAnswer).length}/${quiz.length}`}/>
                                    </Col>
                                </Row>
    
                                {/* display number of questions and timer section */}
                                <Row className='align-items-center'>
                                    <Col xs={6} md={8} className='text-end'>
                                        <p>{noOfExtendTime}/3 time extension remaining</p>
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Container className="d-flex justify-content-end align-items-center">
                                            <OverlayTrigger
                                                key={'bottom'}
                                                placement={'bottom'}
                                                overlay={
                                                    <Tooltip>
                                                        Click to <strong>add 15 seconds!</strong>
                                                    </Tooltip>
                                                }
                                            >
                                                <Button 
                                                    className='add-time-btn'
                                                    onClick={ExtendTime}
                                                >
                                                    <img src='/img/add.png'
                                                        alt='add-more-time'
                                                        width='24'
                                                        height='24'
                                                    />
                                                </Button>
                                            </OverlayTrigger>
                                            <Container className="timer d-inline-flex align-items-center">
                                                <img 
                                                    src="/img/timer.png"
                                                    alt='timer-icon'
                                                />
                                                <span>{timer}s</span>
                                            </Container>
                                        </Container>
                                    </Col>
                                </Row>
                                {zeroExtendTimeAlert &&
                                (
                                    <Alert variant='warning' onClose={() => setZeroExtendTimeAlert(false)} dismissible>
                                        Out of time extensions!
                                    </Alert>
                                )}

                                <hr className='divider'/> 
                                <h2 className='heading'>Q{currentQuestionIndex + 1}. {removeCharacters(quiz[currentQuestionIndex].question)}</h2>
    
                                {/* display hint section */}
                                <Row className='align-items-center'>
                                    <Col xs={6} className='text-end'>
                                        <p>{hintsRemaining}/3 hints remaining</p>
                                    </Col>
                                    <Col xs={6}>
                                        <OverlayTrigger
                                            key={'bottom'}
                                            placement={'bottom'}
                                            overlay={
                                                <Tooltip>
                                                    Click to <strong>display a hint!</strong>
                                                </Tooltip>
                                            }
                                        >
                                            <Button 
                                                className='hint-btn'
                                                onClick={handleHint}
                                            >
                                                <img 
                                                    src='/img/hint.png'
                                                    alt='hint-icon'
                                                    height='24'
                                                    width='24'
                                                />
                                                <span style={{ paddingLeft: '5px' }}>Hints</span>
                                            </Button>
                                        </OverlayTrigger>
                                    </Col>
                                </Row>
                                <Row>
                                    {showHints && usedHints[currentQuestionIndex] && 
                                    (
                                        <p>
                                            Hint for Question {currentQuestionIndex + 1}: Try google?
                                        </p>
                                    )}
                                </Row>
                                {zeroHintAlert &&
                                (
                                    <Alert variant='warning' onClose={() => setZeroHintAlert(false)} dismissible>
                                        Out of hints!
                                    </Alert>
                                )}
                                {hintUsedAlert && 
                                (
                                    <Alert variant='warning' onClose={() => setZeroHintAlert(false)} dismissible>
                                        You already used a hint on this question!
                                    </Alert>
                                )}
    
                                {/* display all quiz answer section */}
                                {quiz[currentQuestionIndex].answers.map((answer, index) => 
                                (
                                    <Button 
                                        key={index} 
                                        variant={selectedAnswer[currentQuestionIndex] === index ? 'light' : 'outline-light'}
                                        onClick={() => handleAnswerSelection(index)}>
                                        {answer}
                                    </Button>
                                ))}
    
                                <hr className='divider'/>  
    
                                {/* question cycling and submit quiz section */}
                                <Row className='align-items-center'>
                                    <Col xs={4} className='d-flex justify-content-end'>
                                        {currentQuestionIndex > 0 && (
                                            <Button className='prev-btn' onClick={handlePrevQuestion}>
                                                <img 
                                                    src='/img/prev.png'
                                                    alt='prev-icon'
                                                    height='24'
                                                    width='24'
                                                />
                                                <span style={{ paddingLeft: '5px' }}>Prev</span>   
                                            </Button>
                                        )}
                                    </Col>
                                    <Col xs={4} className='d-flex justify-content-center'>
                                        <Button className='submit-btn' onClick={submitQuiz}>
                                            Submit
                                        </Button>
                                    </Col>
                                    <Col xs={4} className='d-flex justify-content-start'>
                                        {currentQuestionIndex < quiz.length - 1 && 
                                        (
                                            <Button className='next-btn' onClick={handleNextQuestion}>
                                                <span style={{ paddingRight: '5px' }}>Next</span>
                                                <img 
                                                    src='/img/next.png'
                                                    alt='next-icon'
                                                    height='24'
                                                    width='24'
                                                />
                                            </Button>
                                        )}
                                    </Col>
                                </Row> 
                                {showSubmitAlert &&
                                    <Row>
                                        <Col>
                                            <Alert variant='warning' onClose={() => setShowSubmitAlert(false)} dismissible>
                                                Please answer all questions before submitting the quiz.
                                            </Alert>
                                        </Col>
                                    </Row>
                                }
                            </>
                            ) :
                            ( <h1>No quiz data available.</h1> )
                        ) :
                        // quiz = false, show this
                        (
                            <Container>        
                                <Row style={{ paddingBottom: '2em'}}>
                                    <h2>Are you ready?</h2>                          
                                </Row>   
                                <Row className='justify-content-center'>
                                    <Button className='start-btn' onClick={handleStartQuiz}>Start Quiz</Button>                    
                                </Row>                 
                            </Container>
                        )
                    )
                )}     
            </Container>    
            <Modal
                show={showModal}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header 
                    style=
                    {{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#111827',
                        color: '#fff',
                        textAlign: 'center',
                        borderColor: '#336699'
                    }}
                >
                    <Modal.Title>Time's Up!!!</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style=
                    {{
                        backgroundColor: '#111827',
                        color: '#fff',
                        textAlign: 'center'
                    }}
                >
                    You have ran out of time for this quiz, better luck next time.
                </Modal.Body>
                <Modal.Footer
                    style=
                    {{
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: '#111827',
                        color: '#fff',
                        borderColor: '#336699',
                    }}
                >
                    <Button
                        className='view-results-btn'
                        onClick={viewResult}
                    >
                        View Results
                    </Button>
                    <Button
                        className='modal-another-btn'
                        onClick={() => window.location.reload()}
                    >
                        Start Another Quiz
                    </Button>
                </Modal.Footer>
            </Modal>           
        </Container>
    )
}
