import { useEffect, useState } from 'react'
import { Row, Col, Form, OverlayTrigger, Tooltip, Accordion, Modal, Dropdown, Button, Container } from 'react-bootstrap'
import Switch from 'react-switch'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { Main } from './Main'
import { ComponentSettings } from '../components/ComponentSettings'
import { WebsitePreview } from '../components/WebsitePreview'
import { WebsiteFactory } from '../factories/WebsiteFactory'
import { PageFactory } from '../factories/PageFactory'
import { ComponentFactory } from '../factories/ComponentFactory'
import { ElementFactory } from '../factories/ElementFactory'

import { FaArrowAltCircleRight, FaInfoCircle } from 'react-icons/fa'
import { LuLayoutDashboard } from 'react-icons/lu'
import { GrConfigure } from 'react-icons/gr'
import { LiaPlusSolid, LiaSave, LiaTrashAlt, LiaUserFriendsSolid } from 'react-icons/lia'
import { TiWarningOutline } from 'react-icons/ti'

import type { PageType } from 'website-lib'

export function Pages() {
  const [name, setName] = useState<string | undefined>()
  const [title, setTitle] = useState<string | undefined>()
  const [path, setPath] = useState<string | undefined>()
  const [menu, setMenu] = useState<number | undefined>()
  const [menuOrder, setMenuOrder] = useState<number | undefined>()
  const [enabled, setEnabled] = useState<boolean | undefined>()
  const [page, setPage] = useState<PageType | null>(null)
  const [pages, setPages] = useState<PageType[]>([])
 
  const allWebsites = UseWebsiteStore((state) => state.allWebsites)
  const selectedWebsite = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedWebsiteId = UseWebsiteStore((state) => state.selectedWebsiteId)
  const selectedPageId = UseWebsiteStore((state) => state.selectedPageId)

  const setSelectedWebsite = UseWebsiteStore((state) => state.setSelectedWebsite)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const setSelectedPage = UseWebsiteStore((state) => state.setSelectedPage)

  const [showModalComponent, setShowModalComponent] = useState(false)
  const handleCloseModalComponent = () => setShowModalComponent(false)

  const [showModalSave, setShowModalSave] = useState(false)
  const handleCloseModalSave = () => setShowModalSave(false)

  const hasUnsavedChanges = UseWebsiteStore((state) => state.hasUnsavedChanges)
  const changes = UseWebsiteStore.getState().getChanges()

  const websiteFactory = new WebsiteFactory()
  const pageFactory = new PageFactory()
  const componentFactory = new ComponentFactory()
  const elementFactory = new ElementFactory()
  
  const { updateSelectedPageField } = UseWebsiteStore()

  // Funções para atualizar os campos da página
  const handleNameChange = (newName: string) => {
    setName(newName)
    updateSelectedPageField('name', newName)
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    updateSelectedPageField('title', newTitle)
  }

  const handlePathChange = (newPath: string) => {
    setPath(newPath)
    updateSelectedPageField('path', newPath)
  }

  const handleMenuChange = (newMenu: boolean) => {
    setMenu(newMenu ? 1 : 0)
    updateSelectedPageField('menu', newMenu ? 1 : 0)
  }

  const handleMenuOrderChange = (newMenuOrder: number) => {
    setMenuOrder(newMenuOrder)
    updateSelectedPageField('menuOrder', newMenuOrder)
  }

  const handleEnabledChange = (newEnabled: boolean) => {
    setEnabled(newEnabled)
    updateSelectedPageField('enabled', newEnabled)
  }

  function setCheckedPage(checked: boolean): void {
    const newPath = checked ? '/' : ''
    handlePathChange(newPath)
  }

  function setCheckedMenu(checked: boolean): void {
    handleMenuChange(checked)
  }

  function setCheckedInitialPage(checked: boolean): void {
    handleEnabledChange(checked)
  }

  function handleSelectPage(event: React.ChangeEvent<HTMLSelectElement>): void {
    const pageId = parseInt(event.target.value)
    if (pageId === 0) {
      setPage(null)
      setSelectedPage(null)
      setSelectedPageId(null)
      return
    }
    const selectedPage = pages.find((p) => p.id === pageId) || null
    setPage(selectedPage)
    setSelectedPage(selectedPage)
    setSelectedPageId(selectedPage?.id || null)
  }

  function handleSaveClick(): void {
    console.log('Detalhes das mudanças:', changes)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSelectedWebsite(allWebsites.find((w) => w.id === selectedWebsiteId) || null)
      const pages = selectedWebsite?.pages || []
      setPages(pages)
      if (pages) {
        // Estou pegando a primeira página. Pensar e refatorar para uma melhor abordagem
        setPage(pages[0])
        setSelectedPage(pages[0])
        setSelectedPageId(pages[0].id)
        setPage(pages[0])
        setName(pages[0].name)
        setTitle(pages[0].title)
        setPath(pages[0].path)
        setMenu(pages[0].menu)
        setMenuOrder(pages[0].menuOrder)
        setEnabled(!!pages[0].enabled) // Garantir que sempre trabalhamos com boolean na interface
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [selectedPageId])

  if (!page) {
    return (
      <Main>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <Row className="mt-3">
        <Col>
          <div className="website-card mb-3">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                  <LiaUserFriendsSolid size={24} />
                  <b>GESTÃO DE PÁGINAS</b>
                </div>
              </Col>
              <Col>
                <Row>
                  {hasUnsavedChanges && (
                    <Col lg={12}>
                      <div className='mb-2' style={{background: '#ffc107', padding: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center'}}>
                        <TiWarningOutline size={20} />
                        <span style={{ marginLeft: '5px', fontWeight: 'bold', color: 'black' }}>
                          Você tem alterações não salvas
                        </span>
                      </div>
                    </Col>
                  )}
                  <Col sm={12} md={12} lg={4}>
                    <div className='mb-2' style={{ position: 'relative', border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      {page !== null && (
                        <Row>
                          <Col lg={12} className='mb-2'>
                            <Button 
                              style={{ 
                                background: 'var(--blue3)', 
                                border: 'none',
                                borderRadius: '8px', 
                                padding: '10px',
                                width: '100%',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.2s'
                              }}
                              className='tiktok-sans fw-100'
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <LiaPlusSolid className="me-2" />
                              CRIAR NOVA PÁGINA
                            </Button>
                          </Col>
                          <Col lg={12} className="d-flex align-items-center gap-2 mb-2">
                            <Form.Select
                              aria-label="Selecione"
                              onChange={handleSelectPage}
                            >
                              <option value="0">Selecione uma página</option>
                              {pages.map((p) => (
                                <option key={p.id} value={p.id} selected={p.id === page.id}>
                                  {p.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>
                          <Col style={{ display: 'flex', gap: '10px' }}>
                            <button
                              className="website-navbar-action-buttons website-navbar-action-buttons-success" 
                              onClick={() => setShowModalSave(true)}
                              style={{ cursor: 'auto' }}
                              disabled={!hasUnsavedChanges}
                            >
                              <LiaSave size={30} /> Salvar
                            </button>
                            <Button 
                              variant="danger" 
                            >
                              <LiaTrashAlt size={24} />
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </div>

                    <div style={{ position: 'relative', border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0" className="mb-2 website-accordion-header-border-radius">
                          <Accordion.Header className="website-accordion-header-border-radius">
                            <div className="website-accordion-header">
                              <GrConfigure size={18} />
                              <b>CONFIGURAÇÕES</b>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Row>
                              <Col lg={12}>
                                <Form.Group className="mb-3" controlId="pageName">
                                  <Form.Label>
                                    <b>Nome da página</b>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Digite um nome para a página"
                                    value={name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={12}>
                                <Form.Group className="mb-3" controlId="pageTitle">
                                  <Form.Label>
                                    <b>Título da página</b>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Digite um título para a página"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={3}>
                                <Form.Group className="mb-3" controlId="initialPageSwitch">
                                  <Form.Label>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                      Página inicial
                                      <OverlayTrigger
                                        placement="bottom"
                                        overlay={
                                          <Tooltip id="tooltip-initial-page">
                                            Ative para tornar essa a página inicial do site.
                                          </Tooltip>
                                        }
                                      >
                                        <span style={{ cursor: 'pointer', color: '#A1A1A1' }}>
                                          <FaInfoCircle size={14} />
                                        </span>
                                      </OverlayTrigger>
                                    </span>
                                  </Form.Label>
                                  <div style={{ display: 'flex', marginTop: '8px' }}>
                                    <Switch
                                      onChange={(checked) => setCheckedPage(checked)}
                                      checked={path === '/'}
                                      className="react-switch"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col lg={3}>
                                <Form.Group className="mb-3" controlId="enabledSwitch">
                                  <Form.Label>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                      Publicada
                                      <OverlayTrigger
                                        placement="bottom"
                                        overlay={
                                          <Tooltip id="tooltip-initial-page">Ative para publicar essa página no site.</Tooltip>
                                        }
                                      >
                                        <span className="website-info">
                                          <FaInfoCircle size={14} />
                                        </span>
                                      </OverlayTrigger>
                                    </span>
                                  </Form.Label>
                                  <div style={{ display: 'flex', marginTop: '8px' }}>
                                    <Switch
                                      onChange={(checked) => setCheckedInitialPage(checked)}
                                      checked={!!enabled}
                                      className="react-switch"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col lg={3}>
                                <Form.Group className="mb-3" controlId="menuSwitch">
                                  <Form.Label>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                      Menu
                                      <OverlayTrigger
                                        placement="bottom"
                                        overlay={
                                          <Tooltip id="tooltip-initial-page">
                                            Ative para exibir essa página no menu de navegação do site.
                                          </Tooltip>
                                        }
                                      >
                                        <span className="website-info">
                                          <FaInfoCircle size={14} />
                                        </span>
                                      </OverlayTrigger>
                                    </span>
                                  </Form.Label>
                                  <div style={{ display: 'flex', marginTop: '8px' }}>
                                    <Switch
                                      onChange={(checked) => setCheckedMenu(checked)}
                                      checked={menu === 1}
                                      className="react-switch"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col lg={3}>
                                <Form.Group controlId="positionMenu">
                                  <Form.Label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    Posição
                                    <OverlayTrigger
                                      placement="right"
                                      overlay={
                                        <Tooltip id="tooltip-menu-position">
                                          Define a ordem em que a página aparecerá no menu.
                                        </Tooltip>
                                      }
                                    >
                                      <span style={{ cursor: 'pointer', color: '#A1A1A1' }}>
                                        <FaInfoCircle size={14} />
                                      </span>
                                    </OverlayTrigger>
                                  </Form.Label>
                                  <Form.Control type="number" min={1} value={menuOrder} onChange={(e) => handleMenuOrderChange(parseInt(e.target.value) || 0)}/>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1" className="website-accordion-header-border-radius">
                          <Accordion.Header className="website-accordion-header-border-radius">
                            <div className="website-accordion-header">
                              <LuLayoutDashboard size={18} />
                              <b>COMPONENTES</b>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Accordion>
                              <Button 
                                onClick={() => setShowModalComponent(true)}
                                style={{ 
                                  background: 'var(--blue3)', 
                                  border: 'none',
                                  borderRadius: '8px', 
                                  padding: '10px',
                                  width: '100%',
                                  fontWeight: 'bold',
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.2s',
                                }}
                                className='tiktok-sans fw-100 mb-2'
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)'
                                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)'
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                                }}
                              >
                                <LiaPlusSolid className="me-2" />
                                ADICIONAR COMPONENTE
                              </Button>
                              {page.components.map((component, index) => (
                                <ComponentSettings component={component} key={index} index={index} />
                              ))}
                            </Accordion>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                    
                  </Col>
                  <Col sm={12} md={12} lg={8} className="ps-0">
                    <div style={{ position: 'relative', border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <WebsitePreview />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Modal show={showModalComponent} onHide={handleCloseModalComponent} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Inserir novo componente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
              Selecione um componente
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item href="#">Texto</Dropdown.Item>
              <Dropdown.Item href="#">Lista</Dropdown.Item>
              <Dropdown.Item href="#">Formulário</Dropdown.Item>
              <Dropdown.Item href="#">Imagem</Dropdown.Item>
              <Dropdown.Item href="#">Vídeo</Dropdown.Item>
              <Dropdown.Item href="#">Carrossel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success">
            <LiaSave />
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalSave} onHide={handleCloseModalSave} backdrop="static" keyboard={false} size="lg" centered>
        <Modal.Header>
          <Modal.Title>Alterações realizadas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row style={{ padding: '10px' }}>
              {hasUnsavedChanges ? (
                <>
                  {changes?.changes && changes.changes.length > 0 && (
                    <>
                      <Col lg={12} style={{ background: '#868686ff', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                        <b>Website</b>
                      </Col>
                      {changes.changes.map((change, changeIndex) => (
                        <Col lg={12} className='mb-2' key={changeIndex}>
                          <Row className="d-flex gap-2">
                            <div style={{ flex: 3, padding: '10px', borderRadius: '5px', border: '2px solid #868686ff' }}>
                              <b>{websiteFactory.friendlyFieldName(change.field)}</b>
                            </div>
                            <div style={{ flex: 4, padding: '10px', borderRadius: '5px', border: '2px solid #dc3545' }}>
                              {websiteFactory.friendlyValue(change.field, change.oldValue)}
                            </div>
                            <div className='text-center' style={{ flex: 1, padding: '10px' }}>
                              <FaArrowAltCircleRight />
                            </div>
                            <div style={{ flex: 4, padding: '10px', borderRadius: '5px', border: '2px solid #198754' }}>
                              {websiteFactory.friendlyValue(change.field, change.newValue)}
                            </div>
                          </Row>
                        </Col>
                      ))}
                    </>
                  )}
                  {changes?.page?.changes && changes.page.changes.length > 0 && (
                    <>
                      <Col lg={12} className='mb-2' style={{ background: '#a0a0a0ff', padding: '10px', borderRadius: '5px' }}>
                        <b>Página: {page?.name}</b>
                      </Col>
                      {changes.page.changes.map((change, changeIndex) => (
                        <Col lg={12} className='mb-2' key={changeIndex}>
                          <Row className="d-flex gap-2">
                            <div style={{ flex: 3, padding: '10px', borderRadius: '5px', border: '2px solid #a0a0a0ff' }}>
                              <b>{pageFactory.friendlyFieldName(change.field)}</b>
                            </div>
                            <div style={{ flex: 4, padding: '10px', borderRadius: '5px', border: '2px solid #dc3545' }}>
                              {pageFactory.friendlyValue(change.field, change.oldValue)}
                            </div>
                            <div className='text-center' style={{ flex: 1, padding: '10px' }}>
                              <FaArrowAltCircleRight />
                            </div>
                            <div style={{ flex: 4, padding: '10px', borderRadius: '5px', border: '2px solid #198754' }}>
                              {pageFactory.friendlyValue(change.field, change.newValue)}
                            </div>
                          </Row>
                        </Col>
                      ))}
                    </>
                  )}
                  {(changes?.page?.component && changes.page.component.length > 0) ? (
                    changes.page.component.map((component, index) => (
                      <>
                        <Col lg={12} key={index} className='mb-2' style={{ background: '#BBBBBB', padding: '10px', borderRadius: '5px' }}>
                          <b>Componente: {component.name}</b>
                        </Col>
                        
                        {component.changes?.map((change, changeIndex) => (
                          <Col lg={12} className='mb-2' key={changeIndex}>
                            <Row className="d-flex gap-2">
                              <div style={{ flex: 3, padding: '10px', borderRadius: '5px', border: '2px solid #BBBBBB' }}>
                                <b>{componentFactory.friendlyFieldName(change.field)}</b>
                              </div>
                              <div style={{ flex: 4, padding: '10px', borderRadius: '5px', border: '2px solid #dc3545' }}>
                                {componentFactory.friendlyValue(change.field, change.oldValue)}
                              </div>
                              <div className='text-center' style={{ flex: 1, padding: '10px' }}>
                                <FaArrowAltCircleRight />
                              </div>
                              <div style={{ flex: 4, padding: '10px', borderRadius: '5px', border: '2px solid #198754' }}>
                                {componentFactory.friendlyValue(change.field, change.newValue)}
                              </div>
                            </Row>
                          </Col>
                        ))}
                        
                        {component.element?.map((el, elIndex) => (
                          <>
                            <Col key={elIndex} lg={12} className='mb-2' style={{ background: '#DDDDDD', padding: '10px', borderRadius: '5px' }}>
                              <b>Elemento: {el.elementTypeId}</b>
                            </Col>
                            {el.changes.map((change, changeIndex) => (
                              <Col lg={12} className='mb-2' key={changeIndex}>
                                <Row className="d-flex gap-2">
                                  <div style={{ flex: 3, padding: '10px', borderRadius: '5px', border: '2px solid #DDDDDD' }}>
                                    <b>{elementFactory.friendlyFieldName(change.field)}</b>
                                  </div>
                                  <div style={{ flex: 4, padding: '10px', borderRadius: '5px', border: '2px solid #dc3545' }}>
                                    {elementFactory.friendlyValue(change.field, change.oldValue)}
                                  </div>
                                  <div className='text-center' style={{ flex: 1, padding: '10px' }}>
                                    <FaArrowAltCircleRight />
                                  </div>
                                  <div style={{ flex: 4, padding: '10px', borderRadius: '5px', border: '2px solid #198754' }}>
                                    {elementFactory.friendlyValue(change.field, change.newValue)}
                                  </div>
                                </Row>
                              </Col>
                            ))}
                          </>
                        ))}
                      </>
                    ))
                  ) : (
                    !changes?.changes?.length && !changes?.page?.changes?.length && (
                      <Col lg={12}>
                        Nenhuma alteração encontrada.
                      </Col>
                    )
                  )}
                </>
              ) : (
                <Col lg={12} className='text-center'>
                  Não há alterações para salvar.
                </Col>
              )}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseModalSave}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            onClick={handleSaveClick}
            disabled={!hasUnsavedChanges}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </Main>
  )
}
