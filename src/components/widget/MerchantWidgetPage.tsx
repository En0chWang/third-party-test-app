import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { get } from 'aws-amplify/api';

interface MerchantItem {
    mcid: string;
    updated_time: number;
}
interface ApiData {
    message: MerchantItem[];
    error: string;
}

const MerchantWidgetPage: React.FC = () => {
    const [apiData, setApiData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    useEffect(() => {
        const getMerchants = async ()=> {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString() ?? '';
    
            const currentUser = await getCurrentUser();
            const user_id = currentUser.userId;

            try {
                const restOperation = get({ 
                    apiName: 'myRestApi',
                    path: 'merchants-path',
                    options: {
                        headers: {
                            'Authorization': token
                        },
                        queryParams: {
                            'user_id': user_id,
                        }
                    }
                });
                const { body } = await restOperation.response;
                const str = await body.text();
                console.log(JSON.parse(str));
                setLoading(false);
                setApiData(JSON.parse(str));
            } catch (error) {
                console.log(error);
                setLoading(false);
                setApiData({message: [], error: 'There is something wrong with Widget'});
            }
        };

        getMerchants();
    }, [location]);


    return (
        <Container className="justify-content-center align-items-center">
            <Row className="justify-content-md-center mt-5">
                <Col className="d-flex align-items-center justify-content-center">
                    <h1 className="text-center">Amazon Merchant Management Widget</h1>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="d-flex justify-content-center align-items-center">
                    {loading && (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )}
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    {(apiData && apiData.message.length > 0) && (
                        <Table responsive bordered className="text-center">
                            <thead>
                            <tr>
                                <th>Amazon Merchant ID</th>
                                <th>Last Updated</th>
                            </tr>
                            </thead>
                            <tbody>
                                {apiData.message.map((item, index) => (
                                    <tr key={index}>
                                    <td>{item.mcid}</td>
                                    <td>{new Date(item.updated_time).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        )
                    }
                </Col> 
          </Row>
        </Container>
      );
}

export default MerchantWidgetPage;