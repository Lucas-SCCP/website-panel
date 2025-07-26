import { useState } from 'react'
import { Row, Col, Form, Dropdown } from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { PropertiesSettings } from '../components/PropertiesSettings'
import type { ComponentType, ElementType, ButtonPropertiesType } from 'website-lib'

export function ButtonElement({ element }: { element: ElementType }) {
  const selectedPage = UseWebsiteStore((state) => state.selectedPage)
  const components = selectedPage?.components.find((c: ComponentType) => c.id === element.component_id)
  const alerts = components?.elements.content.filter((e: ElementType) => e.element_type_id === 7)
  const buttons = components?.elements.content.filter((e: ElementType) => e.element_type_id === 8)

  const properties: ButtonPropertiesType = element.properties as ButtonPropertiesType

  const [type, setType] = useState(properties.type)
  const [actionId, setAction] = useState(properties.actionId)
  const [successMessageId, setSuccessMessageId] = useState(properties.successMessageId)
  const [successActionId, setSuccessActionId] = useState(properties.successActionId)

  const handleSelectType = (selectedType: string) => {
    setType(selectedType)
  }

  const handleSelectAction = (selectedAction: number) => {
    setAction(selectedAction)
  }

  const handleSelectSuccessMessageId = (id: number) => {
    setSuccessMessageId(id)
  }

  const handleSelectSuccessActionId = (id: number) => {
    setSuccessActionId(id)
  }

  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto do botão</Form.Label>
          <Form.Control type="text" placeholder="Digite o texto do botão" value={properties.title} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto de carregamento</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o texto de carregamento do botão"
            value={properties.message}
          />
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Tipo de botão</Form.Label>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Selecione'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item onClick={() => handleSelectType('submit')}>Submit</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Ação</Form.Label>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              {actionId ? actionId : 'Selecione'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item onClick={() => handleSelectAction(1)}>Enviar E-mail</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Mensagem de sucesso</Form.Label>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              {successMessageId
                ? alerts?.find((alert: ElementType) => alert.id === successMessageId)?.properties.name
                : 'Selecione'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              {alerts &&
                alerts.map((alert: ElementType, index: number) => (
                  <Dropdown.Item key={index} onClick={() => handleSelectSuccessMessageId(alert.id)}>
                    {alert.properties.name}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Ação após clique</Form.Label>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              Selecione
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item>Exibir botão</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Selecione botão de ação</Form.Label>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              {successActionId
                ? buttons?.find((button: ElementType) => button.id === successActionId)?.properties.title
                : 'Selecione'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              {buttons &&
                buttons.map((button: ElementType, index: number) => (
                  <Dropdown.Item key={index} onClick={() => handleSelectSuccessActionId(button.id)}>
                    {button.properties.title}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Link</Form.Label>
          <Form.Control type="text" placeholder="Digite o link do botão" value={properties.path} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <PropertiesSettings element={element} properties={properties} styles={element.styles} />
      </Col>
    </Row>
  )
}
