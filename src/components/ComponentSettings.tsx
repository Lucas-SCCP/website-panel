import { useState, type JSX } from 'react'
import { Row, Col, Accordion, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ComponentFactory } from '../factories/ComponentFactory'
import { UseWebsiteStore } from '../stores/UseWebsiteStore';
import { FaListUl, FaInfoCircle, FaTextHeight } from 'react-icons/fa'
import { RiInputField } from 'react-icons/ri'
import { TiDelete } from 'react-icons/ti'
import { TbSwitchVertical } from 'react-icons/tb'
import type { WebsiteType, PageType, ComponentType  } from 'website-lib'

export function ComponentSettings({ component, index }: { component: ComponentType, index: number }) {

  const [allSettings, setAllSettings] = useState(false)
  const componentFactory = new ComponentFactory()

  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)
  const updatedComponent: ComponentType | undefined = selectedPage?.components.find((c) => c.id === component.id)

  const { updateSelectedComponentField } = UseWebsiteStore()

  function getIconByComponentType(type: number): JSX.Element {
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

  function handleDeleteComponent(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
    event.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir este componente?')) {
      console.log(`Component with index ${index} would be deleted.`)
    }
  }

  const setValue = (key: keyof ComponentType, value: string) => {
    console.log('setValue', key, value)
    console.log('selectedWebsite', selectedWebsite)
    console.log('selectedPage', selectedPage)
    console.log('component', component)
    if (
      selectedWebsite?.id == null ||
      selectedPage?.id == null ||
      component?.id == null
    ) {
      return
    }
    updateSelectedComponentField(
      component.id,
      key,
      value
    )
  }

  return (
    <Accordion.Item
      eventKey={index.toString()}
      className="mb-3 website-accordion-selected website-accordion-header-border-radius"
    >
      <Accordion.Header className="website-accordion-header-button-bg-gray">
        <div className="website-accordion-header-title-container">
          <div className="website-accordion-header-title">
            {getIconByComponentType(component.component_type_id)} - <b>{component.name}</b>
          </div>
        </div>
        <span className="ms-auto website-accordion-header-action-buttons" style={{ display: 'none' }} id='aSerDesenvolvido'>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-delete-component">Excluir componente</Tooltip>}
          >
            <span onClick={handleDeleteComponent}>
              <TiDelete size={20} style={{ color: 'red' }} />
            </span>
          </OverlayTrigger>
        </span>
        <span className="ms-auto website-accordion-header-action-buttons" style={{ display: 'none' }} id='aSerDesenvolvido'>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-drag-component">Arraste para alterar a ordenação</Tooltip>}
          >
            <span>
              <TbSwitchVertical size={18} />
            </span>
          </OverlayTrigger>
        </span>
      </Accordion.Header>
      <Accordion.Body>
        <Row id="component-settings">
          <Col lg={12}>
            <Form.Group className="mb-3" controlId="componentName">
              <Form.Label>Nome do componente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite um nome para o componente"
                value={updatedComponent?.name}
                onChange={(e) => setValue('name', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={4} lg={2}>
            <Form.Group className="mb-3" controlId="componentSort">
              <Form.Label>Posição</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite uma posição para o componente"
                value={updatedComponent?.sort}
                onChange={(e) => setValue('sort', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={4} lg={3}>
            <Form.Group className="mb-3" controlId="componentSize">
              <Form.Label>Tamanho</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite o tamanho do componente"
                value={updatedComponent?.size}
                onChange={(e) => setValue('size', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={4} lg={6}>
            <Form.Group className="mb-3" controlId="componentEnabledSwitch">
              <Form.Label>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Habilitado
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="tooltip-component-enabled">Ative para exibir esse componente no site.</Tooltip>
                    }
                  >
                    <span className="website-info">
                      <FaInfoCircle size={14} />
                    </span>
                  </OverlayTrigger>
                </span>
              </Form.Label>
              <Form.Check
                type="switch"
                checked={updatedComponent?.enabled}
                onChange={(e) => setValue('enabled', e.target.value)}
                id="componentEnabledSwitch"
                className="form-switch-lg"
              />
            </Form.Group>
          </Col>
          <Col lg={12} style={{ display: 'none' }} id='aSerDesenvolvido'>
            <Form.Group className="mb-3" controlId="componentAllSettingsSwitch">
              <Form.Check
                type="switch"
                checked={allSettings}
                onChange={() => setAllSettings(true)}
                id="componentAllSettingsSwitch"
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Configurações para todos os elementos
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-component-all-settings">Ative para aplicar a mesma configuração a todos os elementos.</Tooltip>
                      }
                    >
                      <span className="website-info">
                        <FaInfoCircle size={14} />
                      </span>
                    </OverlayTrigger>
                  </span>
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row id="component-edit">
          <Row>
            <Col style={{ fontWeight: 'bold', marginBottom: '10px', padding: '0 15px' }}>
              <b>Elementos:</b>
            </Col>
          </Row>
          <Accordion>
            {componentFactory.build(component)}
          </Accordion>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  )
}
