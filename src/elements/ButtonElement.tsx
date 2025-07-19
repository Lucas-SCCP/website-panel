import { useState } from 'react'
import { Row, Col, Form, Dropdown } from 'react-bootstrap'
import type { ComponentType, ElementType } from 'website-lib'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'

export function ButtonElement({ element }: { element: ElementType }) {
  const selectedPage = UseWebsiteStore((state) => state.selectedPage)
  const components = selectedPage?.components.find((c: ComponentType) => c.id === element.component_id)
  const alerts = components?.elements.content.filter((e: ElementType) => e.element_type_id === 7)
  const buttons = components?.elements.content.filter((e: ElementType) => e.element_type_id === 8)

  const [type, setType] = useState(element.properties.type)
  const [action, setAction] = useState(element.properties.action)
  const [successMessageId, setSuccessMessageId] = useState(element.properties.successMessageId)
  const [successActionId, setSuccessActionId] = useState(element.properties.successActionId)

  const handleSelectType = (selectedType: string) => {
    setType(selectedType)
  }

  const handleSelectAction = (selectedAction: string) => {
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
          <Form.Control type="text" placeholder="Digite o texto do botão" value={element.properties.title} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto de carregamento</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o texto de carregamento do botão"
            value={element.properties.loadingMessage}
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
              {action ? action.charAt(0).toUpperCase() + action.slice(1) : 'Selecione'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item onClick={() => handleSelectAction('sendMail')}>Enviar E-mail</Dropdown.Item>
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
          <Form.Control type="text" placeholder="Digite o link do botão" value={element.properties.href} />
        </Form.Group>
      </Col>
      <Col lg={12}>
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
      </Col>
    </Row>
  )
}
