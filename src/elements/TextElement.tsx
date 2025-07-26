import { Row, Col, Form } from 'react-bootstrap'
import { PropertiesSettings } from '../components/PropertiesSettings';
import { UseWebsiteStore } from '../stores/UseWebsiteStore';
import type { ComponentType, ElementType, PageType, WebsiteType } from 'website-lib'

export function TextElement({ element }: { element: ElementType }) {

  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)
  const component: ComponentType | undefined = selectedPage?.components.find((c) => c.id === element.component_id)

  const updatedElement = component?.elements.content.find((e) => e.id === element.id) || element

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
          <Form.Label>Digite o texto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o texto"
            value={updatedElement.properties.title}
            onChange={(e) => setValue('title', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <PropertiesSettings element={updatedElement} properties={updatedElement.properties} styles={updatedElement.styles} />
      </Col>
    </Row>
  )
}
