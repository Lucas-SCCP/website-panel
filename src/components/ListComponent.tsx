import { Row, Col, Accordion, Tabs, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { MdControlPointDuplicate } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { TbSwitchVertical } from 'react-icons/tb'
import { PiArrowBendDownRightBold } from 'react-icons/pi'
import { MdInsertEmoticon } from 'react-icons/md'
import { MdOutlineTextFields } from 'react-icons/md'
import { ElementFactory } from '../factories/ElementFactory'
import type { ComponentType } from 'website-lib'

export function ListComponent({ component }: { component: ComponentType }) {
  const elementFactory = new ElementFactory()
  const elements = component.elements.content

  const icon = elements.filter((e) => e.elementTypeId === 9).sort((a, b) => a.sort - b.sort)
  const text = elements.filter((e) => e.elementTypeId === 12).sort((a, b) => a.sort - b.sort)

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
      console.log(`Component with index ${component.id} would be duplicated.`)
    }
  }

  function handleDeleteElement(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
    event.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir este componente?')) {
      console.log(`Component with index would be deleted.`)
    }
  }

  return result.map((item, index) => (
    <Accordion.Item key={index} eventKey={index.toString()} className="mb-3 website-accordion-selected website-accordion-header-border-radius">
      <Accordion.Header className="website-accordion-header-button-bg-gray">
        <div className="website-accordion-header-title-container">
          <div className="website-accordion-header-title">
            <PiArrowBendDownRightBold />- <b>Item</b>
          </div>
        </div>
        <span className="ms-auto website-accordion-header-action-buttons" style={{ display: 'none' }} id='aSerDesenvolvido'>
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-delete-element">Excluir elemento</Tooltip>}>
            <span onClick={handleDeleteElement}>
              <TiDelete size={20} style={{ color: 'red' }} />
            </span>
          </OverlayTrigger>
        </span>
        <span className="ms-auto website-accordion-header-action-buttons" style={{ display: 'none' }} id='aSerDesenvolvido'>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-duplicate-element">Duplicar elemento</Tooltip>}
          >
            <span onClick={handleDuplicateElement}>
              <MdControlPointDuplicate size={18} />
            </span>
          </OverlayTrigger>
        </span>
        <span className="ms-auto website-accordion-header-action-buttons" style={{ display: 'none' }} id='aSerDesenvolvido'>
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
          <Col lg={12}>
            <Tabs defaultActiveKey="icon" id="configs" fill>
              <Tab eventKey="icon" title={<span><MdInsertEmoticon /> Ícone</span>} className="website-tabs">
                {elementFactory.build(item.icon.elementTypeId, item.icon)}
              </Tab>
              <Tab eventKey="text" title={<span><MdOutlineTextFields /> Texto</span>} className="website-tabs">
                {elementFactory.build(item.text.elementTypeId, item.text)}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  ))
}
