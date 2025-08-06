import { Row, Col, Form, Accordion } from 'react-bootstrap'
import { PropertiesSettings } from '../components/PropertiesSettings'
import { StylesSettings } from '../components/StylesSettings';
import { UseWebsiteStore } from '../stores/UseWebsiteStore';
import type { WebsiteType, PageType, ComponentType, ElementType, InputPropertiesType } from 'website-lib'

export function InputElement({ element }: { element: ElementType }) {

  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)
  const component: ComponentType | undefined = selectedPage?.components.find((c) => c.id === element.component_id)

  const updatedElement = component?.elements.content.find((e) => e.id === element.id) || element
  const properties = updatedElement.properties as InputPropertiesType

  const { updateSelectedElementField } = UseWebsiteStore()

  const setValue = (key: string, value: string) => {
    if (
      selectedWebsite?.id == null ||
      selectedPage?.id == null ||
      component?.id == null
    ) {
      return
    }
    updateSelectedElementField(
      component.id,
      element.id,
      'properties',
      {
        ...updatedElement.properties,
        [key]: value
      }
    )
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
            onChange={(e) => setValue('name', e.target.value)}
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
            onChange={(e) => setValue('placeholder', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Tipo de input</Form.Label>
          <Form.Select
            value={updatedElement.properties.type ? updatedElement.properties.type : 'Selecione'}
            onChange={(e) => setValue('type', e.target.value)}
            aria-label="Selecione"
          >
            <option value="">Selecione</option>
            <option value="texto">Texto</option>
            <option value="numero">Número</option>
            <option value="email">Email</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Tipo de validação</Form.Label>
          <Form.Select
            value={properties.inputValidateId ? properties.inputValidateId : 'Selecione'}
            onChange={(e) => setValue('inputValidateId', e.target.value)}
            aria-label="Selecione"
          >
            <option value="">Selecione</option>
            <option value="1">Nome</option>
            <option value="2">Data de nascimento</option>
            <option value="3">CPF</option>
            <option value="4">E-mail</option>
            <option value="5">Celular</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Accordion>
          <PropertiesSettings element={element} />
          <StylesSettings element={element} />
        </Accordion>
      </Col>
    </Row>
  )
}
