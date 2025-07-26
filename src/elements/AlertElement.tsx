import { Row, Col, Form, Dropdown } from 'react-bootstrap'
import { PropertiesSettings } from '../components/PropertiesSettings'
import type { ElementType } from 'website-lib'

export function AlertElement({ element }: { element: ElementType }) {
  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Nome da mensagem</Form.Label>
          <Form.Control type="text" placeholder="Digite o nome da mensagem" value={element.properties.name} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Título da mensagem</Form.Label>
          <Form.Control type="text" placeholder="Digite o título da mensagem" value={element.properties.title} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto da mensagem</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Digite o texto da mensagem"
            value={element.properties.message}
          />
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Dropdown className="mb-3">
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            Tipo de mensagem
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>Sucesso</Dropdown.Item>
            <Dropdown.Item>Erro</Dropdown.Item>
            <Dropdown.Item>Aviso</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <Col lg={12}>
        <PropertiesSettings element={element} properties={element.properties} styles={element.styles} />
      </Col>
    </Row>
  )
}
