import { Row, Col, Form, Accordion } from 'react-bootstrap'
import { PropertiesSettings } from '../components/PropertiesSettings'
import { StylesSettings } from '../components/StylesSettings';
import type { ElementType, LinkPropertiesType } from 'website-lib'

export function LinkElement({ element }: { element: ElementType }) {
  const properties = element.properties as LinkPropertiesType

  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto</Form.Label>
          <Form.Control type="text" placeholder="Digite o texto para o link" value={properties.title} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Selecione um arquivo</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Accordion>
          <PropertiesSettings element={element} properties={element.properties} />
          <StylesSettings element={element} styles={element.styles} />
        </Accordion>
      </Col>
    </Row>
  )
}
