import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { useLocation } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { AuthUser } from 'aws-amplify/auth';

interface LandingPageProps {
    user: AuthUser | null;
}

const LandingPage: React.FC<LandingPageProps> = (props) => {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    console.log(queryParams);

    const stateToken = queryParams.get('SAMPLE_APP_STATE_TOKEN')
	const spdsAuthCode = queryParams.get('SPDS_AUTH_CODE')

    console.log("Retrieved state token: " + stateToken);
    console.log("Retrieved authorization code: " + spdsAuthCode);

    return (
        <Container>
            <Row className="px-4 my-5">
                <Col sm={5}>
                    
                    {
                        !props.user && (
                            <>
                                <Link
                                    to='/login'>
                                    <Button variant="outline-primary">Login &gt;&gt;</Button>
                                </Link>
                                &nbsp;&nbsp;
                                <Link
                                    to='/register'>
                                    <Button variant="outline-primary">Register &gt;&gt;</Button>
                                </Link>
                            </>
                        )
                    }
                    {
                        props.user && (
                            <p className="font-weight-light">Hello {props.user.signInDetails?.loginId}</p>
                        )
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default LandingPage;