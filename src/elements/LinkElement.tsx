import { Row, Col, Form } from 'react-bootstrap'
import type { ElementType } from 'website-lib'

export function LinkElement({ element }: { element: ElementType }) {
  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto</Form.Label>
          <Form.Control type="text" placeholder="Digite o texto para o link" value={element.properties?.title} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Selecione um arquivo</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
      </Col>
    </Row>
  )
}
