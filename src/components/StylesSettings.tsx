import { Accordion, Row, Col, Form, InputGroup } from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore';
import { LuPaintbrush } from 'react-icons/lu'
import type { WebsiteType, PageType, ComponentType, ElementType } from 'website-lib'

export function StylesSettings({ element }: { element: ElementType }) {

  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)
  const component: ComponentType | undefined = selectedPage?.components.find((c) => c.id === element.component_id)

  const updatedElement = component?.elements.content.find((e) => e.id === element.id) || element

  const { updateSelectedElementField } = UseWebsiteStore()

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
    <Accordion.Item eventKey="1" className='website-accordion-selected website-accordion-header-border-radius'>
      <Accordion.Header className='website-accordion-header-button-bg-gray'>
        <div className="website-accordion-header-title-container">
          <div className="website-accordion-header-title">
            <LuPaintbrush /> - <b>Estilo</b>
          </div>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <Row className='mb-2' style={{ border: '3px solid #EEEEEE', padding: '10px', borderRadius: '5px' }}>
          <Col lg={4}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Cor de fundo</Form.Label>
              <Form.Control
                type="color"
                value={updatedElement.styles.backgroundColor ? updatedElement.styles.backgroundColor : '#FFFFFF'}
                onChange={(e) => setStylesValue('backgroundColor', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Largura</Form.Label>
              <Form.Control
                type="number"
                min={1}
                placeholder='width'
                value={updatedElement.styles.width ? updatedElement.styles.width : ''}
                onChange={(e) => setStylesValue('width', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Altura</Form.Label>
              <Form.Control
                type="number"
                min={1}
                placeholder='height'
                value={updatedElement.styles.height ? updatedElement.styles.height : ''}
                onChange={(e) => setStylesValue('height', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Display</Form.Label>
              <Form.Control
                type="text"
                placeholder="display"
                value={updatedElement.styles.display}
                onChange={(e) => setStylesValue('display', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Alinhamento de itens</Form.Label>
              <Form.Control
                type="text"
                placeholder="align-items"
                value={updatedElement.styles.alignItems}
                onChange={(e) => setStylesValue('alignItems', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className='mb-2' style={{ border: '3px solid #EEEEEE', padding: '10px', borderRadius: '5px' }}>
          <Col lg={12} className='mb-2' style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <b>Fonte</b>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Cor</Form.Label>
              <Form.Control
                type="color"
                value={updatedElement.styles.color ? updatedElement.styles.color : '#FFFFFF'}
                onChange={(e) => setStylesValue('color', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Label htmlFor="basic-url">Tamanho</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control 
                type="number"
                min={1}
                value={updatedElement.styles?.fontSize?.replace('px', '')}
                onChange={(e) => setStylesValue('fontSize', e.target.value + 'px')}                
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col lg={4}>
            <Form.Label htmlFor="basic-url">Peso</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control 
                type="number"
                min={1}
                value={updatedElement.styles.fontWeight}
                onChange={(e) => setStylesValue('fontWeight', e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col lg={4}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Alinhamento</Form.Label>
              <Form.Select style={{ width: '100%' }} value={updatedElement.styles.textAlign} onChange={(e) => setStylesValue('textAlign', e.target.value)}>
                <option value="">Selecione</option>
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className='mb-2' style={{ border: '3px solid #EEEEEE', padding: '10px', borderRadius: '5px' }}>
          <Col lg={12} className='mb-2' style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <b>Borda</b>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Cor</Form.Label>
              <Form.Control
                type="color"
                value={updatedElement.styles.borderColor ? updatedElement.styles.borderColor : '#FFFFFF'}
                onChange={(e) => setStylesValue('borderColor', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>border-radius</Form.Label>
              <Form.Control
                type="number"
                min={1}
                placeholder='border-radius'
                value={updatedElement.styles.borderRadius ? updatedElement.styles.borderRadius.replace('px', '') : ''}
                onChange={(e) => setStylesValue('borderRadius', e.target.value + 'px')}
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Estilo</Form.Label>
              <Form.Control
                type="text"
                value={updatedElement.styles.borderStyle ? updatedElement.styles.borderStyle : ''}
                onChange={(e) => setStylesValue('borderStyle', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Largura</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={updatedElement.styles.borderWidth ? updatedElement.styles.borderWidth.replace('px', '') : ''}
                onChange={(e) => setStylesValue('borderWidth', e.target.value + 'px')}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className='mb-2' style={{ border: '3px solid #EEEEEE', padding: '10px', borderRadius: '5px' }}>
          <Col lg={12} className='mb-2' style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <b>Margem</b>
          </Col>
          <Col lg={6}>
            <Form.Label>Superior</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                min={1}
                placeholder='margin-top'
                value={updatedElement.styles.marginTop ? updatedElement.styles.marginTop.replace('px', '') : ''}
                onChange={(e) => setStylesValue('marginTop', e.target.value + 'px')}
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col lg={6}>
            <Form.Label>Esquerda</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                min={1}
                placeholder='margin-left'
                value={updatedElement.styles.marginLeft ? updatedElement.styles.marginLeft.replace('px', '') : ''}
                onChange={(e) => setStylesValue('marginLeft', e.target.value + 'px')}
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col lg={6}>
            <Form.Label>Direita</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                min={1}
                placeholder='margin-right'
                value={updatedElement.styles.marginRight ? updatedElement.styles.marginRight.replace('px', '') : ''}
                onChange={(e) => setStylesValue('marginRight', e.target.value + 'px')}
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col lg={6}>
            <Form.Label>Inferior</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                min={1}
                placeholder='margin-bottom'
                value={updatedElement.styles.marginBottom ? updatedElement.styles.marginBottom.replace('px', '') : ''}
                onChange={(e) => setStylesValue('marginBottom', e.target.value + 'px')}
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <Row className='mb-2' style={{ border: '3px solid #EEEEEE', padding: '10px', borderRadius: '5px' }}>
          <Col lg={12} className='mb-2' style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <b>Preenchimento</b>
          </Col>
          <Col lg={6}>
            <Form.Label>Superior</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                min={1}
                placeholder='padding-top'
                value={updatedElement.styles.paddingTop ? updatedElement.styles.paddingTop.replace('px', '') : ''}
                onChange={(e) => setStylesValue('paddingTop', e.target.value + 'px')}
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col lg={6}>
            <Form.Label>Esquerda</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                min={1}
                placeholder='padding-left'
                value={updatedElement.styles.paddingLeft ? updatedElement.styles.paddingLeft.replace('px', '') : ''}
                onChange={(e) => setStylesValue('paddingLeft', e.target.value + 'px')}
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col lg={6}>
            <Form.Label>Direita</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                min={1}
                placeholder='padding-right'
                value={updatedElement.styles.paddingRight ? updatedElement.styles.paddingRight.replace('px', '') : ''}
                onChange={(e) => setStylesValue('paddingRight', e.target.value + 'px')}
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col lg={6}>
            <Form.Label>Inferior</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                min={1}
                placeholder='padding-bottom'
                value={updatedElement.styles.paddingBottom ? updatedElement.styles.paddingBottom.replace('px', '') : ''}
                onChange={(e) => setStylesValue('paddingBottom', e.target.value + 'px')}
              />
              <InputGroup.Text id="basic-addon3">
                px
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <Row style={{ display: 'none' }} id='camposOcultos'>
          <Col lg={4} style={{ display: 'none' }}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Object fit</Form.Label>
              <Form.Control
                type="text"
                value={updatedElement.styles.objectFit}
                onChange={(e) => setStylesValue('objectFit', e.target.value)}
              />
            </Form.Group>
          </Col>          
          <Col lg={4} style={{ display: 'none' }}>
            <Form.Group className="mb-3" controlId="pageName">
              <Form.Label>Flutuação</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o texto"
                value={updatedElement.styles.float}
                onChange={(e) => setStylesValue('float', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  )
}