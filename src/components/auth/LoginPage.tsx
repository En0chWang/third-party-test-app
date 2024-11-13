import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signIn, signOut } from 'aws-amplify/auth'; 
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = async () => {
        try {
            console.log('Login');
            console.log(username);
            console.log(password);
            setLoginError('');
            await signOut();
            const user = await signIn({username, password});
            console.log(user);

            const queryParams = new URLSearchParams(location.search);
            console.log(queryParams)
            const amazon_callback_uri = queryParams.get('amazon_callback_uri')
            const amazon_state = queryParams.get('amazon_state')

            // Needs for SSO 
            const amazonReturnURI = queryParams.get('amazonReturnURI'); // intermediary consent page
    
            const thirdPartyState = '3pstate';
            const thirdPartyReturnURI = encodeURIComponent(`https://${window.location.host}/landing`); // 3p landing page

            if (amazonReturnURI) {
                const redirectUrl = `${amazonReturnURI}&thirdPartyState=${thirdPartyState}&thirdPartyReturnURI=${thirdPartyReturnURI}`;
                console.log("After login redirect URL: " + redirectUrl);
                
                window.location.href = redirectUrl
            } else if (amazon_callback_uri && amazon_state) {
                const redirectUrl = `${amazon_callback_uri}?redirect_uri=${thirdPartyReturnURI}&amazon_state=${amazon_state}&state=3pstate`;
        
                console.log("After login redirect URL: " + redirectUrl);
                
                window.location.href = redirectUrl
            } else {
                navigate('/landing')
            }
        } catch (err) { 
            console.log(err);
            setLoginError('Invaid Username or password'); // Set the error message
        }
    }

    const handleCancel = () => {

        const queryParams = new URLSearchParams(location.search);
        console.log(queryParams)
        const amazonReturnURI = queryParams.get('amazonReturnURI');
        if (amazonReturnURI) {
            const decodedUrl = decodeURIComponent(amazonReturnURI);
            const params = new URLSearchParams(decodedUrl);
            const finalAmazonRedirectURI = params.get('finalAmazonRedirectURI');
            if (finalAmazonRedirectURI) {
                window.location.href = `${finalAmazonRedirectURI}&3pLoginStatus=incomplete`
            }
            return;
        }
    }

    return (
        <Container>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Row className="justify-content-md-center">
                <Col md="auto">
                    { loginError && (
                        <Alert variant="danger">
                            {loginError}
                        </Alert>
                    )}
                </Col>
            </Row>
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
                            <Button variant="outline-primary" onClick={handleCancel}>
                                Cancel</Button>
                        </Link>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage;