import { Container, Row, Col, Card } from 'react-bootstrap';
import Menu from '../components/Menu';
import BarCharts from '../charts/BarCharts';
import AreaCharts from '../charts/AreaCharts';

export default function Home() {
  return (
    <Container fluid className='text-center'>
      <Row>
        <Menu />
        <Col lg={10}>
          <Row>
            <Col lg={4} style={{ marginTop: '10px' }}>
              <Card>
                <Card.Body>
                  <Card.Title>Visitantes por período</Card.Title>
                  <Card.Text>
                    <BarCharts />
                    Gráfico com total de visitantes por dia/mes/ano
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} style={{ marginTop: '10px' }}>
              <Card>
                <Card.Body>
                  <Card.Title>Visitantes por página</Card.Title>
                  <Card.Text>
                    <AreaCharts />
                    Gráfico com total de visitantes por página
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} style={{ marginTop: '10px' }}>
              <Card>
                <Card.Body>
                  <Card.Title>Formulário recebidos</Card.Title>
                  <Card.Text>
                    Gráfico com o total de formulários recebidos
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
