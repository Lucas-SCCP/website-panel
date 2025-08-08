import { Row, Col, Form, Accordion } from 'react-bootstrap'
import { PropertiesSettings } from '../components/PropertiesSettings'
import { StylesSettings } from '../components/StylesSettings'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import type { WebsiteType, PageType, ComponentType, ElementType } from 'website-lib'

export function AlertElement({ element }: { element: ElementType }) {
  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)
  const component: ComponentType | undefined = selectedPage?.components.find((c) => c.id === element.component_id)

  const updatedElement = component?.elements.content.find((e) => e.id === element.id) || element

  const { updateSelectedElementField } = UseWebsiteStore()

  const setValue = (key: string, file: string) => {
    if (
      file == null ||
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
        [key]: file
      }
    )
  }

  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Nome da mensagem</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome da mensagem"
            value={updatedElement.properties.name}
            onChange={(e) => setValue('name', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Título da mensagem</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o título da mensagem"
            value={updatedElement.properties.title}
            onChange={(e) => setValue('title', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto da mensagem</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Digite o texto da mensagem"
            value={updatedElement.properties.message}
            onChange={(e) => setValue('message', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Ação de sucesso</Form.Label>
          <Form.Select
            value={updatedElement.properties.type ? updatedElement.properties.type : 'undefined'}
            onChange={(e) => setValue('type', e.target.value)}
            aria-label="Selecione"
          >
            <option value="undefined">Selecione</option>
            <option value="success">Sucesso</option>
            <option value="error">Erro</option>
            <option value="warning">Aviso</option>
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
