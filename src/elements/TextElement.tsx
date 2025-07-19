import { Row, Col, Form } from 'react-bootstrap'
import type { Element } from '../types/Website'

type TextElementProps = {
  element: Element,
  showSettings?: boolean
}

export default function TextElement({ element, showSettings }: TextElementProps) {
  function setValue(value: string): void {
    console.log('Setting value:', value);
  }

  return (
    <Row>
      <Col>
        <Row>
          <Col lg={12}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>
                Texto
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o texto"
                value={element.properties.text}
                onChange={e => setValue(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row style={{ display: showSettings ? 'block' : 'none' }}>
          <Col lg={12}>
            Configurações
            <hr />
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Posição do elemento
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o texto"
                    value={element.sort}
                    onChange={e => setValue(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Tamanho do elemento
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o texto"
                    value={element.size}
                    onChange={e => setValue(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
          <Col lg={12}>
            Estilo
            <hr />
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Cor
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o texto"
                    value={element.properties.style.color ? element.properties.style.color : ''}
                    onChange={e => setValue(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Tamanho da fonte
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o texto"
                    value={element.properties.style.fontSize}
                    onChange={e => setValue(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Alinhamento do texto
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o texto"
                    value={element.properties.style.textAlign}
                    onChange={e => setValue(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Peso da fonte
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o texto"
                    value={element.properties.style.fontWeight}
                    onChange={e => setValue(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}