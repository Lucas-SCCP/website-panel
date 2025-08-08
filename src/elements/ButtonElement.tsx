import { Row, Col, Form, Accordion } from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { PropertiesSettings } from '../components/PropertiesSettings'
import { StylesSettings } from '../components/StylesSettings';
import type { WebsiteType, PageType, ComponentType, ElementType, ButtonPropertiesType } from 'website-lib'

export function ButtonElement({ element }: { element: ElementType }) {
  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)
  const component: ComponentType | undefined = selectedPage?.components.find((c) => c.id === element.component_id)

  const updatedElement = component?.elements.content.find((e) => e.id === element.id) || element

  const properties = updatedElement.properties as ButtonPropertiesType

  console.log('properties.errorMessageId', properties.errorMessageId)

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

  const alerts = component?.elements.content.filter((e: ElementType) => e.element_type_id === 7)
  const buttons = component?.elements.content.filter((e: ElementType) => e.element_type_id === 8)

  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Nome do botão</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome do botão"
            value={properties.name}
            onChange={(e) => setValue('name', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto do botão</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o texto do botão"
            value={properties.title}
            onChange={(e) => setValue('title', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Texto de carregamento</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o texto de carregamento do botão"
            value={properties.message}
            onChange={(e) => setValue('message', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Tipo de botão</Form.Label>
          <Form.Select
            value={properties.type ? properties.type : 'undefined'}
            onChange={(e) => setValue('type', e.target.value)}
            aria-label="Selecione"
          >
            <option value="undefined">Selecione</option>
            <option value="submit">Submit</option>
            <option value="button">Button</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Ação</Form.Label>
          <Form.Select
            value={properties.actionId ? properties.actionId : 'undefined'}
            onChange={(e) => setValue('actionId', e.target.value)}
            aria-label="Selecione"
          >
            <option value="undefined">Selecione</option>
            <option value="1">Enviar e-mail</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Mensagem de sucesso</Form.Label>
          <Form.Select
            value={properties.successMessageId ? properties.successMessageId : 'undefined'}
            onChange={(e) => setValue('successMessageId', e.target.value)}
            aria-label="Selecione"
          >
            <option value="undefined">Selecione</option>
            {alerts && alerts.map((alert: ElementType, index: number) => (
              <option key={index} value={alert.id}>{alert.properties.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Ação de sucesso</Form.Label>
          <Form.Select
            value={properties.successActionId ? properties.successActionId : 'undefined'}
            onChange={(e) => setValue('successActionId', e.target.value)}
            aria-label="Selecione"
          >
            <option value="undefined">Selecione</option>
            {buttons && buttons.map((button: ElementType, index: number) => (
              <option key={index} value={button.id}>{button.properties.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Mensagem de erro</Form.Label>
          <Form.Select
            value={properties.errorMessageId ? properties.errorMessageId : 'undefined'}
            onChange={(e) => setValue('errorMessageId', e.target.value)}
            aria-label="Selecione"
          >
            <option value="undefined">Selecione</option>
            {alerts && alerts.map((alert: ElementType, index: number) => (
              <option key={index} value={alert.id}>{alert.properties.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={6}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Ação de erro</Form.Label>
          <Form.Select
            value={properties.errorActionId ? properties.errorActionId : 'undefined'}
            onChange={(e) => setValue('errorActionId', e.target.value)}
            aria-label="Selecione"
          >
            <option value="undefined">Selecione</option>
            {buttons && buttons.map((button: ElementType, index: number) => (
              <option key={index} value={button.id}>{button.properties.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Form.Group className="mb-3" controlId="pageName">
          <Form.Label>Link</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o link do botão"
            value={properties.path}
            onChange={(e) => setValue('path', e.target.value)}
          />
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
