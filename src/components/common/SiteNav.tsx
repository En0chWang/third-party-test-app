import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser, signOut } from 'aws-amplify/auth';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

interface SiteNavProps {
    user : AuthUser | null;
}

const SiteNav: React.FC<SiteNavProps> = (props) => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            console.log('Logout');
            await signOut();
            navigate('/login')
        } catch (err) { console.log(err) }
    }

    return (
        <header>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container>    
                   <Navbar.Brand><Nav.Link href="/">Test App</Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {
                            props.user ? (
                                <Nav className="ms-md-auto"> 
                                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                                </Nav>
                            ) :
                            (
                                <Nav className="ms-md-auto">
                                    <Nav.Link href="/login">Login</Nav.Link>
                                    <Nav.Link href="/register">Register</Nav.Link>
                                </Nav>
                            )
                        }            
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default SiteNav;