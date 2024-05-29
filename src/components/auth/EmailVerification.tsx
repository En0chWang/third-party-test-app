import React, { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface EmailVerificationProps {
    username: string
}
const EmailVerification: React.FC<EmailVerificationProps> = (props) => {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');
    const { username } = props;
    const handleSubmit = async () => {
        try {
            console.log('verify');
            console.log(username);
            console.log(verificationCode);  
            const data = await confirmSignUp({username, confirmationCode: verificationCode});
            if (data.isSignUpComplete === true) {
                navigate('/login')
            }
        } catch (err) { 
            console.log(err);
        }
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <Row className="px-4 my-5">
            <Col sm={6}>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Email Verification Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter Verification Code"
                            onChange={evt => setVerificationCode(evt.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="button"
                            onClick={handleSubmit}>Verify &gt;&gt;</Button>
                    </Form>
                </Col>
            </Row>
    </div>
  );
};

export default EmailVerification;
