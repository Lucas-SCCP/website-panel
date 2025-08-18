import type { JSX } from 'react'
import { Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ElementFactory } from '../factories/ElementFactory'
import { FaListUl, FaTextHeight } from 'react-icons/fa'
import { RiInputField } from 'react-icons/ri'
import { MdControlPointDuplicate } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { TbSwitchVertical } from 'react-icons/tb'
import { FaLink } from 'react-icons/fa'
import { MdAdsClick } from 'react-icons/md'
import { BiSolidMessageDetail } from 'react-icons/bi'
import type { ComponentType } from 'website-lib'

export function FormComponent(props: { component: ComponentType }) {
  const elementFactory = new ElementFactory()

  function getIconByElementType(type: number): JSX.Element | null {
    switch (type) {
      case 14:
        return <FaTextHeight size={18} />
      case 15:
        return <FaListUl size={18} />
      case 12:
        return <FaTextHeight size={18} />
      case 10:
        return <RiInputField size={18} />
      case 11:
        return <FaLink size={18} />
      case 8:
        return <MdAdsClick size={18} />
      case 7:
        return <BiSolidMessageDetail size={18} />
      default:
        return null
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

  return props.component.elements.content.map((element, index) => (
    <Accordion.Item key={index} eventKey={index.toString()} className="mb-3 website-accordion-selected website-accordion-header-border-radius">
      <Accordion.Header className="website-accordion-header-button-bg-gray">
        <div className="website-accordion-header-title-container">
          <div className="website-accordion-header-title">
            {getIconByElementType(element.elementTypeId)} - <b>{getNameElementByType(element.elementTypeId)}</b>
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
      <Accordion.Body>{elementFactory.build(element.elementTypeId, element)}</Accordion.Body>
    </Accordion.Item>
  ))
}
