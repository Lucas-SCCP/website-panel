import { Container, Row, Col } from 'react-bootstrap';
import Menu from '../components/Menu';

export default function Settings() {
  return (
    <Container fluid className='text-center'>
      <Row>
        <Menu />
        <Col lg={10} style={{  }}>
          Configurações
        </Col>
      </Row>
    </Container>
  );
}
