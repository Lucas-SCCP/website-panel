import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Row,
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
} from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'
import { FaHome } from 'react-icons/fa'
import { MdOutlineSettings } from 'react-icons/md'
import { MdAddCircleOutline } from 'react-icons/md'
import { HiOutlineLogout } from 'react-icons/hi'
import { MdSaveAlt } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import { TiWarningOutline } from 'react-icons/ti'
import type { WebsiteType, PageType } from 'website-lib'

export function Menu() {
  const navigate = useNavigate()

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

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
  }, [allWebsites, selectedWebsiteId, selectedPageId, setSelectedWebsiteId, setSelectedPage]);

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
                  <Nav.Link>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id={'tooltip-bottom'}>Página inicial</Tooltip>}
                    >
                      <div onClick={goToDashboardClick} className="website-navbar-button website-navbar-button-icon">
                        <FaHome size={30} />
                      </div>
                    </OverlayTrigger>
                  </Nav.Link>
                  <Nav.Link>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id={'tooltip-bottom'}>Configurações</Tooltip>}>
                      <div onClick={goToSettingsClick} className="website-navbar-button website-navbar-button-icon">
                        <MdOutlineSettings size={30} />
                      </div>
                    </OverlayTrigger>
                  </Nav.Link>
                  <Nav.Link>
                    <NavDropdown
                      title={selectedWebsiteId ? allWebsites.find((w) => w.id === selectedWebsiteId)?.name : 'Selecione um site'}
                      className="website-navbar-button"
                    >
                      {allWebsites.map((website) => (
                        <NavDropdown.Item id={website.id.toString()} key={website.id} onClick={selectedWebsiteClick}>
                          {website.name}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                  </Nav.Link>
                  <Nav.Link>
                    <NavDropdown
                      title={selectedPageId ? allWebsites.find((w) => w.id === selectedWebsiteId)?.pages.find((p) => p.id === selectedPageId)?.name : 'Selecione uma página'}
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
                      <Nav.Link>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip id="tooltip-delete-page">Excluir página</Tooltip>}
                        >
                          <div className="website-navbar-action-buttons website-navbar-action-buttons-danger">
                            <MdDeleteForever size={30} />
                          </div>
                        </OverlayTrigger>
                      </Nav.Link>
                      <Nav.Link>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-menu-position" onClick={handleShow}>
                              Inserir novo componente
                            </Tooltip>
                          }
                        >
                          <div className="website-navbar-action-buttons website-navbar-action-buttons-success">
                            <MdAddCircleOutline size={30} />
                          </div>
                        </OverlayTrigger>
                      </Nav.Link>
                      <Nav.Link>
                        <div className="website-navbar-action-buttons website-navbar-action-buttons-success">
                          <MdSaveAlt size={30} />
                        </div>
                      </Nav.Link>
                      <Nav.Link>
                        {hasUnsavedChanges && (
                          <div style={{background: '#edc707', padding: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center'}}>
                            <TiWarningOutline size={20} />
                            <span style={{ marginLeft: '5px', fontWeight: 'bold', color: 'black' }}>
                              Você tem alterações não salvas
                            </span>
                          </div>
                        )}
                      </Nav.Link>
                    </>
                  )}
                  <Nav.Link className="ms-auto d-flex">
                    <OverlayTrigger placement="left" overlay={<Tooltip id={'tooltip-bottom'}>Sair</Tooltip>}>
                      <div onClick={handleExit} className="website-navbar-action-exit">
                        <HiOutlineLogout size={30} />
                      </div>
                    </OverlayTrigger>
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </Row>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
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
    </>
  )
}
