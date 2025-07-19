import { Row, Col, Form, Accordion, Tabs, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap'
import type { ComponentType } from 'website-lib'

import TextElement from '../elements/TextElement'
import IconElement from '../elements/IconElement'

import { MdControlPointDuplicate } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { TbSwitchVertical } from 'react-icons/tb'
import { PiArrowBendDownRightBold } from 'react-icons/pi'

export default function ListComponent(props: { component: ComponentType }) {
  const elements = props.component.elements.content

  const icon = elements.filter((e) => e.element_type_id === 9).sort((a, b) => a.sort - b.sort)
  const text = elements.filter((e) => e.element_type_id === 12).sort((a, b) => a.sort - b.sort)

  const result = []
  const len = Math.max(icon.length, text.length)

  for (let i = 0; i < len; i++) {
    const item = {
      icon: icon[i] || null,
      text: text[i] || null
    }
    result.push(item)
  }

  function handleDuplicateElement(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
    event.stopPropagation()
    if (window.confirm('Duplicar o componente?')) {
      console.log(`Component with index ${props.component.id} would be duplicated.`)
    }
  }

  function handleDeleteElement(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
    event.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir este componente?')) {
      console.log(`Component with index would be deleted.`)
    }
  }

  return result.map((item, index) => (
    <Accordion.Item key={index} eventKey={index.toString()}>
      <Accordion.Header>
        <div className="website-accordion-header-title-container">
          <div className="website-accordion-header-title">
            <PiArrowBendDownRightBold />- <b>Item</b>
          </div>
        </div>
        <span className="ms-auto website-accordion-header-action-buttons">
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-delete-element">Excluir elemento</Tooltip>}>
            <span onClick={handleDeleteElement}>
              <TiDelete size={20} style={{ color: 'red' }} />
            </span>
          </OverlayTrigger>
        </span>
        <span className="ms-auto website-accordion-header-action-buttons">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-duplicate-element">Duplicar elemento</Tooltip>}
          >
            <span onClick={handleDuplicateElement}>
              <MdControlPointDuplicate size={18} />
            </span>
          </OverlayTrigger>
        </span>
        <span className="ms-auto website-accordion-header-action-buttons">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-drag-element">Arraste para alterar a ordenação</Tooltip>}
          >
            <span>
              <TbSwitchVertical size={18} />
            </span>
          </OverlayTrigger>
        </span>
      </Accordion.Header>
      <Accordion.Body>
        <Row>
          <Col lg={3}>
            <IconElement element={item.icon} />
          </Col>
          <Col lg={9}>
            <TextElement element={item.text} showSettings={false} />
          </Col>
          <Col lg={12}>
            <Tabs defaultActiveKey="icon" id="configs" fill>
              <Tab eventKey="icon" title="Ícone" className="website-tabs">
                Estilo
                <hr />
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="pageName">
                      <Form.Label>Cor</Form.Label>
                      <Form.Control type="text" placeholder="Digite o texto" />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="pageName">
                      <Form.Label>Tamanho da fonte</Form.Label>
                      <Form.Control type="text" placeholder="Digite o texto" />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="text" title="Texto" className="website-tabs">
                Estilo
                <hr />
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="pageName">
                      <Form.Label>Cor</Form.Label>
                      <Form.Control type="text" placeholder="Digite o texto" />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="pageName">
                      <Form.Label>Tamanho da fonte</Form.Label>
                      <Form.Control type="text" placeholder="Digite o texto" />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  ))
}
