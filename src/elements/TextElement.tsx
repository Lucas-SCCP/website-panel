import { Row, Col, Form } from 'react-bootstrap'
import { PropertiesSettings } from '../components/PropertiesSettings';
import type { ElementType } from 'website-lib'

export function TextElement({ element }: { element: ElementType }) {
  function setValue(value: string): void {
    console.log('Setting value:', value)
  }

  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Digite o texto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o texto"
            value={element.properties.title}
            onChange={(e) => setValue(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <PropertiesSettings properties={element.properties} styles={element.styles} />
      </Col>
    </Row>
  )
}
