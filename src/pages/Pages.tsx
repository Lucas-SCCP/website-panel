import { Container, Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Menu from '../components/Menu';
import Component from '../components/Component';
import { FaInfoCircle } from "react-icons/fa";

export default function Pages() {
  return (
    <Container fluid>
      <Row>
        <Menu />
        <Col lg={4}>
          <div style={{ marginTop: '10px', border: '1px solid #BBB', borderRadius: '5px', padding: '10px' }}>
            <Row>
              <Col lg={12}>
                <b>Configurações da página</b>
                <hr />
              </Col>
              <Col lg={12}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Nome da página
                  </Form.Label>
                  <Form.Control type="text" placeholder="Digite um nome para a página" />
                </Form.Group>
              </Col>
              <Col lg={12}>
                <Form.Group className="mb-3" controlId="pageTitle">
                  <Form.Label>
                    Título da página
                  </Form.Label>
                  <Form.Control type="text" placeholder="Digite um título para a página" />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageTitle">
                  <Form.Check
                    type="switch"
                    id="initialPageSwitch"
                    label={
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Página inicial
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-initial-page">
                              Ative para tornar essa a página inicial do site.
                            </Tooltip>
                          }
                        >
                          <span style={{ cursor: 'pointer', color: '#A1A1A1' }}>
                            <FaInfoCircle size={14} />
                          </span>
                        </OverlayTrigger>
                      </span>
                    }
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageTitle">
                  <Form.Check
                    type="switch"
                    id="initialPageSwitch"
                    label={
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Exibir no menu
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-initial-page">
                              Ative para exibir essa página no menu de navegação do site.
                            </Tooltip>
                          }
                        >
                          <span style={{ cursor: 'pointer', color: '#A1A1A1' }}>
                            <FaInfoCircle size={14} />
                          </span>
                        </OverlayTrigger>
                      </span>
                    }
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageTitle">
                  <Form.Check
                    type="switch"
                    id="initialPageSwitch"
                    label={
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Visível
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-initial-page">
                              Ative para publicar essa página no site.
                            </Tooltip>
                          }
                        >
                          <span style={{ cursor: 'pointer', color: '#A1A1A1' }}>
                            <FaInfoCircle size={14} />
                          </span>
                        </OverlayTrigger>
                      </span>
                    }
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Posição no menu
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="tooltip-menu-position">
                          Define a ordem em que a página aparecerá no menu.
                        </Tooltip>
                      }
                    >
                      <span style={{ cursor: 'pointer', color: '#A1A1A1' }}>
                        <FaInfoCircle size={14} />
                      </span>
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <Component />
        </Col>
      </Row>
    </Container>
  );
}
