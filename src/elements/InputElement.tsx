import { useState } from 'react'
import { Row, Col, Form, Dropdown } from 'react-bootstrap'
import { PropertiesSettings } from '../components/PropertiesSettings'
import type { ElementType, InputPropertiesType } from 'website-lib'

export function InputElement({ element }: { element: ElementType }) {
  const properties = element.properties as InputPropertiesType

  const [type, setType] = useState(properties.type)
  const [inputValidateId, setValidationType] = useState(properties.inputValidateId)

  const handleSelectType = (selectedType: string) => {
    setType(selectedType)
  }

  const handleSelectValidationType = (selectedInputValidateId: number) => {
    setValidationType(selectedInputValidateId)
  }

  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Nome do campo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o texto de título do formulário"
            value={properties.name}
          />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Placeholder</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o texto de placeholder"
            value={properties.placeholder}
          />
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Tipo de input</Form.Label>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Selecione'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item onClick={() => handleSelectType('texto')}>Texto</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectType('numero')}>Número</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectType('email')}>Email</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Tipo de validação</Form.Label>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              {inputValidateId ? inputValidateId : 'Selecione'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item onClick={() => handleSelectValidationType(1)}>Nome</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectValidationType(2)}>Celular</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectValidationType(3)}>Email</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectValidationType(4)}>
                Data de nascimento
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectValidationType(5)}>CPF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      </Col>
      <Col lg={12}>
        <PropertiesSettings element={element} properties={element.properties} styles={element.styles} />
      </Col>
    </Row>
  )
}
