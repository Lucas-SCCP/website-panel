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
  Dropdown
} from 'react-bootstrap'

import { ApiService } from '../services/ApiService'

import { useWebsiteStore } from '../stores/UseWebsiteStore'
import { useUserStore } from '../stores/UseUserStore'

import type { WebsiteType } from 'website-lib'

import { FaHome } from 'react-icons/fa'
import { MdOutlineSettings } from 'react-icons/md'
import { MdAddCircleOutline } from 'react-icons/md'
import { HiOutlineLogout } from 'react-icons/hi'
import { MdSaveAlt } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'

export default function Menu() {
  const navigate = useNavigate()

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { user } = useUserStore()

  const websites = useWebsiteStore((state) => state.data)
  const selectedWebsite = useWebsiteStore((state) => state.selectedWebsite)
  const selectedPage = useWebsiteStore((state) => state.selectedPage)
  const setWebsiteData = useWebsiteStore((state) => state.setWebsiteData)
  const setSelectedWebsite = useWebsiteStore((state) => state.setSelectedWebsite)
  const setSelectedPage = useWebsiteStore((state) => state.setSelectedPage)

  const goToDashboardClick = () => {
    setSelectedPage(null)
    navigate('/')
  }

  const goToSettingsClick = () => {
    setSelectedPage(null)
    navigate('/settings')
  }

  const selectedWebsiteClick = (event: React.MouseEvent<HTMLElement>) => {
    const selected = websites.find((w) => w.id.toString() === event.currentTarget.id)
    if (selected) {
      setSelectedPage(null)
      setSelectedWebsite(selected)
      navigate('/')
    }
  }

  const selectedPageClick = (event: React.MouseEvent<HTMLElement>) => {
    const selected = selectedWebsite?.pages.find(
      (w: { id: number; name: string }) => w.id.toString() === event.currentTarget.id
    )
    if (selected) {
      setSelectedPage(selected)
      navigate('/pages')
    }
  }

  const handleExit = () => {
    setSelectedPage(null)
    setSelectedWebsite(null)
    useWebsiteStore.getState().clearWebsiteData()
    useUserStore.getState().clearUser()
    navigate('/login')
  }

  useEffect(() => {
    const fetchWebsites = async () => {
      if (selectedWebsite) {
        return
      }

      let websites: WebsiteType[] = []
      if (user && user.id && user.token) {
        const apiService = new ApiService()
        websites = await apiService.getAllWebsiteByUserId(user.id, user.token)
      }

      setWebsiteData(websites)
      const selectedWebsiteFound = websites.find((site) => site.id === user?.default_website_id)
      console.log(selectedWebsiteFound)
      setSelectedWebsite(selectedWebsiteFound ?? null)
    }

    fetchWebsites()
  }, [user, selectedWebsite, setWebsiteData, setSelectedWebsite])

  if (!websites) {
    console.log('Site não carregou')
  }

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
                      title={selectedWebsite ? selectedWebsite.name : 'Selecione um site'}
                      className="website-navbar-button"
                    >
                      {websites.map((website) => (
                        <NavDropdown.Item id={website.id.toString()} key={website.id} onClick={selectedWebsiteClick}>
                          {website.name}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                  </Nav.Link>
                  <Nav.Link>
                    <NavDropdown
                      title={selectedPage ? selectedPage.name : 'Selecione uma página'}
                      className="website-navbar-button"
                    >
                      {selectedWebsite?.pages.map((page: { id: number; name: string }) => (
                        <NavDropdown.Item id={page.id.toString()} key={page.id} onClick={selectedPageClick}>
                          {page.name}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                  </Nav.Link>
                  {selectedPage !== null && (
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
