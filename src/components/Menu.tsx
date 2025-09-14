import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Navbar,
  Container,
  Offcanvas,
  Nav,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
  Button,
  Modal,
  Dropdown,
  Badge
} from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'
import { WebsiteFactory } from '../factories/WebsiteFactory'
import { PageFactory } from '../factories/PageFactory'
import { ComponentFactory } from '../factories/ComponentFactory'
import { ElementFactory } from '../factories/ElementFactory'
import { FaHome, FaRegSave, FaArrowAltCircleRight } from 'react-icons/fa'
import { MdOutlineSettings, MdAddCircleOutline, MdSaveAlt, MdDeleteForever } from 'react-icons/md'
import { HiOutlineLogout } from 'react-icons/hi'
import { TiWarningOutline } from 'react-icons/ti'
import { IoNotificationsOutline } from "react-icons/io5"
import type { WebsiteType, PageType } from 'website-lib'

export function Menu() {
  const websiteFactory = new WebsiteFactory()
  const pageFactory = new PageFactory()
  const componentFactory = new ComponentFactory()
  const elementFactory = new ElementFactory()
  const navigate = useNavigate()

  const [showModalComponent, setShowModalComponent] = useState(false)
  const handleCloseModalComponent = () => setShowModalComponent(false)
  const handleShowModalComponent = () => setShowModalComponent(true)

  const [showModalSave, setShowModalSave] = useState(false)
  const handleCloseModalSave = () => setShowModalSave(false)

  const [website, setWebsite] = useState<WebsiteType | null>(null)
  const [page, setPage] = useState<PageType | null>(null)

  const allWebsites = UseWebsiteStore((state) => state.allWebsites)
  const selectedWebsiteId = UseWebsiteStore((state) => state.selectedWebsiteId)
  const selectedPageId = UseWebsiteStore((state) => state.selectedPageId)
  const setSelectedWebsiteId = UseWebsiteStore((state) => state.setSelectedWebsiteId)
  const setSelectedWebsite = UseWebsiteStore((state) => state.setSelectedWebsite)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const setSelectedPage = UseWebsiteStore((state) => state.setSelectedPage)

  const hasUnsavedChanges = UseWebsiteStore((state) => state.hasUnsavedChanges)
  const changes = UseWebsiteStore.getState().getChanges()

  const goToDashboardClick = () => {
    setSelectedPageId(null)
    navigate('/')
  }

  const goToSettingsClick = () => {
    setSelectedPageId(null)
    navigate('/settings')
  }

  const selectedWebsiteClick = (event: React.MouseEvent<HTMLElement>) => {
    const website = allWebsites.find((w) => w.id.toString() === event.currentTarget.id)
    if (website) {
      setSelectedPageId(null)
      setSelectedWebsite(website)
      setSelectedWebsiteId(website.id)
      navigate('/')
    }
  }

  const selectedPageClick = (event: React.MouseEvent<HTMLElement>) => {
    const website = allWebsites.find((w) => w.id === selectedWebsiteId)
    const page = website?.pages.find(
      (w: { id: number; name: string }) => w.id.toString() === event.currentTarget.id
    )
    if (page) {
      setPage(page)
      setSelectedPage(page)
      setSelectedPageId(page.id)
      navigate('/pages')
    }
  }

  const handleSaveClick = () => {
    console.log('Detalhes das mudanças:', changes)
  }

  const handleOpenModalSaveClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    event.preventDefault()
    setShowModalSave(true)
    console.log('handleOpenModalSaveClick', changes)
  }

  const handleExit = () => {
    setSelectedPageId(null)
    setSelectedWebsiteId(null)
    UseWebsiteStore.getState().clearAllWebsites()
    UseUserStore.getState().clearUser()
    navigate('/login')
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const website = allWebsites.find((w) => w.id === selectedWebsiteId)
      if (website) {
        setWebsite(website)
        setSelectedWebsite(website)
        setSelectedWebsiteId(selectedWebsiteId)
        if (selectedPageId) {
          const page = website.pages.find((p) => p.id === selectedPageId)
          if (page) {
            setPage(page)
            setSelectedPage(page)
          }
        }
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [allWebsites, selectedWebsiteId, selectedPageId, setSelectedWebsiteId, setSelectedWebsite, setSelectedPage])

  return (
    <>
      <Row>
        <Navbar expand="lg" className="website-navbar">
          <Container fluid>
            <Navbar.Brand className="website-navbar-brand">
              <img alt="NOIS" src="/favicon.ico" className="d-inline-block align-top website-navbar-brand-logo" />
              <span className="krona">PAINEL ADMINISTRATIVO</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand" />
            <Navbar.Offcanvas id="offcanvasNavbar-expand" aria-labelledby="offcanvasNavbarLabel-expand" placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand">Painel Administrativo</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="w-100">
                  <Nav.Link style={{ cursor: 'auto' }}>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id={'tooltip-bottom'}>Página inicial</Tooltip>}
                    >
                      <div onClick={goToDashboardClick} className="website-navbar-button website-navbar-button-icon">
                        <FaHome size={30} />
                      </div>
                    </OverlayTrigger>
                  </Nav.Link>
                  <Nav.Link style={{ cursor: 'auto' }}>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id={'tooltip-bottom'}>Configurações</Tooltip>}>
                      <div onClick={goToSettingsClick} className="website-navbar-button website-navbar-button-icon">
                        <MdOutlineSettings size={30} />
                      </div>
                    </OverlayTrigger>
                  </Nav.Link>
                  <Nav.Link style={{ cursor: 'auto' }}>
                    <NavDropdown
                      title={<b>{selectedWebsiteId ? allWebsites.find((w) => w.id === selectedWebsiteId)?.name : 'Selecione um site'}</b>}
                      className="website-navbar-button"
                    >
                      {allWebsites.map((website) => (
                        <NavDropdown.Item id={website.id.toString()} key={website.id} onClick={selectedWebsiteClick}>
                          {website.name}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                  </Nav.Link>
                  <Nav.Link style={{ cursor: 'auto' }}>
                    <NavDropdown
                      title={<b>{selectedPageId ? allWebsites.find((w) => w.id === selectedWebsiteId)?.pages.find((p) => p.id === selectedPageId)?.name : 'Selecione uma página'}</b>}
                      className="website-navbar-button"
                    >
                      {website?.pages.map((page: { id: number; name: string }) => (
                        <NavDropdown.Item id={page.id.toString()} key={page.id} onClick={selectedPageClick}>
                          {page.name}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                  </Nav.Link>
                  {page !== null && (
                    <>
                      <Nav.Link style={{ cursor: 'auto', display: 'none' }} id='aSerDesenvolvido'>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip id="tooltip-delete-page">Excluir página</Tooltip>}
                        >
                          <div className="website-navbar-action-buttons website-navbar-action-buttons-danger">
                            <MdDeleteForever size={30} />
                          </div>
                        </OverlayTrigger>
                      </Nav.Link>
                      <Nav.Link style={{ cursor: 'auto', display: 'none' }} id='aSerDesenvolvido'>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-menu-position">
                              Inserir novo componente
                            </Tooltip>
                          }
                        >
                          <div className="website-navbar-action-buttons website-navbar-action-buttons-success" onClick={handleShowModalComponent}>
                            <MdAddCircleOutline size={30} />
                          </div>
                        </OverlayTrigger>
                      </Nav.Link>
                      <Nav.Link style={{ cursor: 'auto', display: hasUnsavedChanges ? 'block' : 'none' }}>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-menu-position">
                              Salvar todas as alterações
                            </Tooltip>
                          }
                        >
                          <div className="website-navbar-action-buttons website-navbar-action-buttons-success" onClick={handleOpenModalSaveClick}>
                            <FaRegSave size={30} />
                          </div>
                        </OverlayTrigger>
                      </Nav.Link>
                      <Nav.Link style={{ cursor: 'auto' }}>
                        {hasUnsavedChanges && (
                          <div style={{background: '#ffc107', padding: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center'}}>
                            <TiWarningOutline size={20} />
                            <span style={{ marginLeft: '5px', fontWeight: 'bold', color: 'black' }}>
                              Você tem alterações não salvas
                            </span>
                          </div>
                        )}
                      </Nav.Link>
                    </>
                  )}
                  <div className="ms-auto d-flex">
                    <Nav.Link style={{ display: 'none' }} id='aSerDesenvolvido'>
                      <div className="website-navbar-action-exit">
                        <IoNotificationsOutline size={30} />
                        <Badge pill bg="danger" style={{ display: 'none', fontSize: '10px', position: 'absolute', top: 40, right: 84 }}>
                          9
                        </Badge>
                      </div>
                    </Nav.Link>
                    <Nav.Link>
                      <OverlayTrigger placement="left" overlay={<Tooltip id={'tooltip-bottom'}>Sair</Tooltip>}>
                        <div onClick={handleExit} className="website-navbar-action-exit">
                          <HiOutlineLogout size={30} />
                        </div>
                      </OverlayTrigger>
                    </Nav.Link>
                  </div>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
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
            <MdSaveAlt />
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
    </>
  )
}
