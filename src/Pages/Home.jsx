import './Home.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function Home()
{   
    const navigate = useNavigate();
    const handleStart = () =>
    {
        navigate('/quiz');
    };

    return (
        <Container className="home-container">
            <Container className='home'>
                <h1>Welcome to this awesome quiz web app</h1>
                <Button 
                    className='get-started-btn'
                    onClick={handleStart}
                >
                    Get Started
                </Button>
            </Container>
        </Container>
    )
}