import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { AuthUser, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { post } from 'aws-amplify/api';

interface LWAPageProps {
    user: AuthUser | null;
}

interface AuthCodeData {
    message?: string;
    error?: string;
}

const LWAPage: React.FC<LWAPageProps> = (props) => {
    const [apiData, setApiData] = useState<AuthCodeData | null>(null);
    const [isLinkingNeeded, setIsLinkingNeeded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const getItem = async () => {
            try {
                console.log('getting token');
        
                const session = await fetchAuthSession();
                const token = session.tokens?.idToken?.toString() ?? '';

                const currentUser = await getCurrentUser();
                const user_id = currentUser.userId;

                const queryParams = new URLSearchParams(location.search);
                console.log(queryParams);

	            const lwaCode = queryParams.get('code') ?? '';

                console.log("Retrieved authorization code: " + lwaCode);
                if (lwaCode === '') {
                    return;
                }
                setIsLinkingNeeded(true);
                const restOperation = post({ 
                    apiName: 'myRestApi',
                    path: 'lwa-path',
                    options: {
                        headers: {
                            'Authorization': token
                        },
                        queryParams: {
                            'lwa_auth_code': lwaCode,
                            'user_id': user_id,
                        }
                    }
                });
                const { body } = await restOperation.response;
                const str = await body.text();
                console.log(JSON.parse(str));
                setApiData(JSON.parse(str));
            } catch (error) {
                console.log(error)
                setApiData(null);
            }
        };
        console.log(props.user);
        console.log("calling getItem()");
        getItem();
    }, [location])

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
                            <>
                                <p className="font-weight-light">Hello {props.user.signInDetails?.loginId}</p>
                            </>
                        )
                    }
                </Col>
            </Row>
            {(apiData && isLinkingNeeded && apiData.error && apiData.error !== '') && 
            (
            <Row className="px-4 my-5">
                <Alert variant="danger" dismissible>
                    <Alert.Heading>Oh snap! Authorization Failed</Alert.Heading>
                    <p>
                        {apiData.error}
                    </p>
                </Alert>
            </Row>)}

            {(apiData && isLinkingNeeded && apiData.message && apiData.message !== '') && 
            (
            <Row className="px-4 my-5">
                <Alert variant="success">
                    <Alert.Heading>Authorization Succeeded</Alert.Heading>
                    <p>
                        {apiData.message}
                    </p>
                </Alert>
            </Row>)}


        </Container>
    )
}

export default LWAPage;