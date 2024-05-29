import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signIn, signOut } from 'aws-amplify/auth'; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            console.log('Login');
            console.log(username);
            console.log(password);
            await signOut();
            const user = await signIn({username, password});
            console.log(user);

            const queryParams = new URLSearchParams(location.search);
            console.log(queryParams);
            const amazonCallbackUri = queryParams.get('amazon_callback_uri')
            const amazonState = queryParams.get('amazon_state')
            console.log("amazon callback: " + amazonCallbackUri)
            console.log("amazon state: " + amazonState)

            if (amazonCallbackUri && amazonState) {
                const landingUrl = encodeURIComponent(`https://${window.location.host}/landing`);
                const redirectUrl = `${amazonCallbackUri}?redirect_uri=${landingUrl}&amazon_state=${amazonState}&state=3pstate`;
        
                console.log("After login redirect URL: " + redirectUrl);
                
                window.location.href = redirectUrl
            } else {
                navigate('/landing')
            }
        } catch (err) { console.log(err) }
    }

    return (
        <Container>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Row className="justify-content-md-center">
                <Col md="auto"><h1>Login</h1></Col>
            </Row>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicText">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter User Name"
                                onChange={event => setUserName(event.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" minLength={8} placeholder="Enter Password"
                                onChange={event => setPassword(event.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="button"
                            onClick={handleLogin}>Login &gt;&gt;</Button>
                        &nbsp;&nbsp;
                        <Link
                            to='/register'>
                            <Button variant="outline-primary">Register</Button>
                        </Link>
                        &nbsp;&nbsp;
                        <Link
                            to='/'>
                            <Button variant="outline-primary">Cancel</Button>
                        </Link>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage;