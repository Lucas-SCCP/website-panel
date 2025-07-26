import type { JSX } from 'react'
import { Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ElementFactory } from '../factories/ElementFactory'
import { FaListUl, FaTextHeight } from 'react-icons/fa'
import { RiInputField } from 'react-icons/ri'
import { MdControlPointDuplicate } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { TbSwitchVertical } from 'react-icons/tb'
import type { ComponentType } from 'website-lib'

export function TextComponent({ component }: { component: ComponentType }) {
  const elementFactory = new ElementFactory()

  function getIconByElementType(type: number): JSX.Element {
    switch (type) {
      case 14:
        return <FaTextHeight size={18} />
      case 15:
        return <FaListUl size={18} />
      case 16:
        return <RiInputField size={18} />
      default:
        return <FaTextHeight size={18} />
    }
  }

  function getNameElementByType(type: number): string {
    switch (type) {
      case 12:
        return 'Texto'
      case 15:
        return 'Lista'
      case 16:
        return 'Formulário'
      case 9:
        return 'Icone'
      case 10:
        return 'Input'
      case 8:
        return 'Botão'
      case 7:
        return 'Alerta'
      case 11:
        return 'Link'
      default:
        return 'Padrão'
    }
  }

  function handleDuplicateElement(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
    event.stopPropagation()
    if (window.confirm('Duplicar o componente?')) {
      console.log(`Component with index would be deleted.`)
    }
  }

  function handleDeleteElement(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
    event.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir este componente?')) {
      console.log(`Component with index would be deleted.`)
    }
  }

  return component.elements.content.map((element, index) => (
    <Accordion.Item key={index} eventKey={index.toString()} className="mb-3 website-accordion-selected website-accordion-header-border-radius">
      <Accordion.Header className="website-accordion-header-button-bg-gray">
        <div className="website-accordion-header-title-container">
          <div className="website-accordion-header-title">
            {getIconByElementType(element.element_type_id)} - <b>{getNameElementByType(element.element_type_id)}</b>
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
        {elementFactory.build(element.element_type_id, element)}
      </Accordion.Body>
    </Accordion.Item>
  ))
}
