import { Accordion, Row, Col, Form, InputGroup } from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore';
import { LuPaintbrush } from 'react-icons/lu'
import { MdOutlineSettings } from 'react-icons/md'
import type { WebsiteType, PageType, ComponentType, ElementType, PropertiesType, StylesType } from 'website-lib'

export function PropertiesSettings({ element, properties, styles }: { element: ElementType, properties: PropertiesType, styles: StylesType }) {

  console.log('PropertiesSettings element:', element)
  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)
  const component: ComponentType | undefined = selectedPage?.components.find((c) => c.id === element.component_id)

  const updatedElement = component?.elements.content.find((e) => e.id === element.id) || element

  const { updateSelectedElementField } = UseWebsiteStore()

  const setElementValue = (key: keyof ElementType, value: number) => {
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
      key,
      value
    )
  }

  const setPropertiesValue = (key: string, value: string) => {
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

  const setStylesValue = (key: string, value: string) => {
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
      'styles',
      {
        ...updatedElement.styles,
        [key]: value
      }
    )
  }

  return (
    <Accordion>
      <Accordion.Item eventKey="0" className='mb-3 website-accordion-selected website-accordion-header-border-radius'>
        <Accordion.Header className="website-accordion-header-button-bg-gray">
          <div className="website-accordion-header-title-container">
            <div className="website-accordion-header-title">
              <MdOutlineSettings /> - <b>Configurações</b>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col lg={3}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Posição</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Digite a posição"
                  value={updatedElement.sort}
                  onChange={(e) => setElementValue('sort', Number(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Tamanho</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Digite o tamanho"
                  value={updatedElement.size}
                  onChange={(e) => setElementValue('size', Number(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Iniciar oculto</Form.Label>
                <Form.Select value={properties.startHidden ? 'true' : 'false'} onChange={(e) => setPropertiesValue('startHidden', e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1" className='website-accordion-selected website-accordion-header-border-radius'>
        <Accordion.Header className='website-accordion-header-button-bg-gray'>
          <div className="website-accordion-header-title-container">
            <div className="website-accordion-header-title">
              <LuPaintbrush /> - <b>Estilo</b>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Cor</Form.Label>
                <Form.Control
                  type="color"
                  placeholder="Digite o texto"
                  value={styles.color ? styles.color : ''}
                  onChange={(e) => setStylesValue('color', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={4}>
              <Form.Label htmlFor="basic-url">Tamanho</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type="text"
                  placeholder="Digite o texto"
                  value={styles?.fontSize?.replace('px', '')}
                  onChange={(e) => setStylesValue('fontSize', e.target.value + 'px')}                
                />
                <InputGroup.Text id="basic-addon3">
                  px
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col lg={4}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Alinhamento</Form.Label>
                <Form.Select style={{ width: '100%' }} value={styles.textAlign} onChange={(e) => setStylesValue('textAlign', e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="left">Esquerda</option>
                  <option value="center">Centro</option>
                  <option value="right">Direita</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId="pageName">
                <Form.Label>Peso</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o texto"
                  value={styles.fontWeight}
                  onChange={(e) => setStylesValue('fontWeight', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}