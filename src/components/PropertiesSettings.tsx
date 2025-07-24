import { Accordion, Row, Col, Form } from 'react-bootstrap'
import { LuPaintbrush } from 'react-icons/lu'
import { MdOutlineSettings } from 'react-icons/md'
import type { PropertiesType, StylesType } from 'website-lib'

export function PropertiesSettings({ properties, styles }: { properties: PropertiesType, styles: StylesType }) {
  function setValue(value: string): void {
    console.log('Setting value:', value)
  }

  return (
    <Accordion>
      <Accordion.Item eventKey="0" className='mb-3 website-accordion-selected website-accordion-header-border-radius'>
        <Accordion.Header className="website-accordion-header-button-bg-gray">
          <div className="website-accordion-header-title-container">
            <div className="website-accordion-header-title">
              <MdOutlineSettings /> - <b>Configurações</b>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Posição do elemento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o texto"
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Tamanho do elemento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o texto"
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Iniciar oculto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o texto"
                  value ={properties.startHidden ? 'Sim' : 'Não'}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1" className='website-accordion-selected website-accordion-header-border-radius'>
        <Accordion.Header className='website-accordion-header-button-bg-gray'>
          <div className="website-accordion-header-title-container">
            <div className="website-accordion-header-title">
              <LuPaintbrush /> - <b>Estilo</b>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Cor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o texto"
                  value={styles.color ? styles.color : ''}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Tamanho da fonte</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o texto"
                  value={styles.fontSize}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Alinhamento do texto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o texto"
                  value={styles.textAlign}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Peso da fonte</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o texto"
                  value={styles.fontWeight}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}