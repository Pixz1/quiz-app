import './Header.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export default function Header()
{
    return (
        <Container fluid className='navbar-container'>
            <Navbar expand='lg' className='navbar'>
                <Container>
                    <Navbar.Brand as={Link} to='/'>
                        <img
                            alt='logo'
                            src='/img/image001.png'
                            width='230'
                            height='32'
                            className='d-inline-block align-top'
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav variant='underline' defaultActiveKey='/home' className='ms-auto nav-items'>
                            <Nav.Item>
                                <Nav.Link as={Link} to='/'>Home</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to='/quiz'>Quiz</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    )
}