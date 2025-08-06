import { Accordion, Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore';
import { MdOutlineSettings } from 'react-icons/md'
import { FaInfoCircle } from 'react-icons/fa'
import type { WebsiteType, PageType, ComponentType, ElementType } from 'website-lib'

export function PropertiesSettings({ element }: { element: ElementType }) {

  // console.log('PropertiesSettings element:', element)
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
    console.log('selectedWebsite', selectedWebsite)
    console.log('selectedPage', selectedPage)
    console.log('component', component)
    console.log('key', key)
    console.log('value', value)
    if (
      selectedWebsite?.id == null ||
      selectedPage?.id == null ||
      component?.id == null
    ) {
      return
    }

    let newValue: string | boolean = value
    if (key === 'startHidden') {
      newValue = value === 'true' ? true : false
    }

    updateSelectedElementField(
      component.id,
      element.id,
      'properties',
      {
        ...updatedElement.properties,
        [key]: newValue
      }
    )
  }

  return (
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
              <Form.Label>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Tamanho
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="tooltip-component-enabled">
                        Seguimos o padrão do Bootstrap onde a tela é dividida em 12 partes.
                        Para mais informações consulte nossa página de ajuda.
                      </Tooltip>
                    }
                  >
                    <span className="website-info">
                      <FaInfoCircle size={14} />
                    </span>
                  </OverlayTrigger>
                </span>
              </Form.Label>
              <Form.Select value={updatedElement?.size ? updatedElement.size : ""} onChange={(e) => setElementValue('size', Number(e.target.value))} aria-label="Selecione">
                <option value="">Selecione</option>
                <option value="1">8%</option>
                <option value="2">16%</option>
                <option value="3">25%</option>
                <option value="4">33%</option>
                <option value="5">41%</option>
                <option value="6">50%</option>
                <option value="7">58%</option>
                <option value="8">66%</option>
                <option value="9">75%</option>
                <option value="10">83%</option>
                <option value="11">91%</option>
                <option value="12">100%</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Iniciar oculto</Form.Label>
              <Form.Select value={updatedElement.properties.startHidden ? 'true' : 'false'} onChange={(e) => setPropertiesValue('startHidden', e.target.value)}>
                <option value="">Selecione</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  )
}