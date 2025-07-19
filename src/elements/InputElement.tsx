import { useState } from 'react';
import { Row, Col, Form, Dropdown } from 'react-bootstrap'
import type { ElementType } from 'website-lib'

export default function InputElement({ element }: { element : ElementType }) {

  const [type, setType] = useState(element.properties.type);
  const [validationType, setValidationType] = useState(element.properties.validateType);

  const handleSelectType = (selectedType: string) => {
    setType(selectedType);
    console.log('Selected input type:', selectedType);
  };

  const handleSelectValidationType = (selectedValidationType: string) => {
    setValidationType(selectedValidationType);
    console.log('Selected validation type:', selectedValidationType);
  };

  console.log('InputElement rendered with element:', element);
  console.log(element.properties.type)

  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>
            Nome do campo
          </Form.Label>
          <Form.Control type="text" placeholder="Digite o texto de título do formulário" value={element.properties.name} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>
            Placeholder
          </Form.Label>
          <Form.Control type="text" placeholder="Digite o texto de placeholder" value={element.properties.placeholder} />
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>
            Tipo de input
          </Form.Label>
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
          <Form.Label>
            Tipo de validação
          </Form.Label>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              {validationType ? validationType.charAt(0).toUpperCase() + validationType.slice(1) : 'Selecione'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item onClick={() => handleSelectValidationType('nome')}>Nome</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectValidationType('celular')}>Celular</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectValidationType('email')}>Email</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectValidationType('dataDeNascimento')}>Data de nascimento</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectValidationType('cpf')}>CPF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
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
              <Form.Control type="text" placeholder="Digite o texto" value={element.properties.style?.color} />
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>
                Tamanho da fonte
              </Form.Label>
              <Form.Control type="text" placeholder="Digite o texto" />
            </Form.Group>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}