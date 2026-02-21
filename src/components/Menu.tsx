import { useNavigate, useLocation } from 'react-router-dom'
import {
  Row,
  Navbar,
  Container,
  Offcanvas,
  Nav,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
  Badge
} from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'
import { 
  LiaBell,
  LiaCogSolid,
  LiaUserLockSolid,
  LiaUserFriendsSolid,
  LiaHomeSolid,
  LiaSignOutAltSolid,
  LiaBookSolid,
  LiaPagerSolid
} from "react-icons/lia";
import { AccessLevelEnum } from '../enums/AcessLevelEnum'

export function Menu() {
  const location = useLocation()
  const navigate = useNavigate()

  const allWebsites = UseWebsiteStore((state) => state.allWebsites)
  const selectedWebsiteId = UseWebsiteStore((state) => state.selectedWebsiteId)
  const setSelectedWebsiteId = UseWebsiteStore((state) => state.setSelectedWebsiteId)
  const setSelectedWebsite = UseWebsiteStore((state) => state.setSelectedWebsite)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)


  const selectedWebsiteClick = (event: React.MouseEvent<HTMLElement>) => {
    const website = allWebsites.find((w) => w.id.toString() === event.currentTarget.id)
    if (website) {
      setSelectedPageId(null)
      setSelectedWebsite(website)
      setSelectedWebsiteId(website.id)
      navigate('/')
    }
  }

  const handleExit = () => {
    setSelectedPageId(null)
    setSelectedWebsiteId(null)
    UseWebsiteStore.getState().clearAllWebsites()
    UseUserStore.getState().clearUser()
    navigate('/login')
  }


  return (
    <Row>
      <Navbar expand="lg" className="website-navbar">
        <Container fluid>
          <Navbar.Brand className="website-navbar-brand">
            <img alt="NOIS" src="/favicon.ico" className="d-inline-block align-top website-navbar-brand-logo" />
            <span className="tiktok-sans fw-700" style={{ color: '#FFF', fontSize: '1.5rem' }}>PixelBuild</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand" style={{ border: '1px solid var(--blue3)' }} />
          <Navbar.Offcanvas id="offcanvasNavbar-expand" aria-labelledby="offcanvasNavbarLabel-expand" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand">Painel Administrativo</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="w-100">
                <Nav.Link id="websiteSelect" style={{ cursor: 'auto' }}>
                  <NavDropdown
                    title={<b>{selectedWebsiteId ? allWebsites.find((w) => w.id === selectedWebsiteId)?.name : 'Selecione um site'}</b>}
                    className="website-navbar-button"
                    style={{ border: '1px solid var(--blue3)' }}
                  >
                    {allWebsites.map((website) => (
                      <NavDropdown.Item id={website.id.toString()} key={website.id} onClick={selectedWebsiteClick}>
                        {website.name}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                </Nav.Link>
                {selectedWebsiteId && <>
                  <Nav.Link id="dashboard" style={{ cursor: 'auto' }}>
                    <button 
                      onClick={() => navigate('/')} 
                      className={`website-navbar-button website-navbar-button-icon ${location.pathname === '/' ? 'active' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                    >
                      <LiaHomeSolid size={30} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>INICIO</div>
                    </button>
                  </Nav.Link>
                  <Nav.Link id="pages" style={{ cursor: 'auto', display: UseUserStore.getState().userAccessLevelId === AccessLevelEnum.SuperUsuario ? 'auto' : 'none' }}>
                    <button
                      onClick={() => navigate('/pages')}
                      className={`website-navbar-button website-navbar-button-icon ${location.pathname === '/pages' ? 'active' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                    >
                      <LiaPagerSolid size={30} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>PÁGINAS</div>
                    </button>
                  </Nav.Link>
                  <Nav.Link id="leads" style={{ cursor: 'auto' }}>
                    <button
                      onClick={() => navigate('/leads')}
                      className={`website-navbar-button website-navbar-button-icon ${location.pathname === '/leads' ? 'active' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                    >
                      <LiaUserFriendsSolid size={30} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>LEADS</div>
                    </button>
                  </Nav.Link>
                  <Nav.Link id="posts" style={{ cursor: 'auto' }}>
                    <button
                      onClick={() => navigate('/posts')}
                      className={`website-navbar-button website-navbar-button-icon ${location.pathname === '/posts' ? 'active' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                    >
                      <LiaBookSolid size={30} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>POSTS</div>
                    </button>
                  </Nav.Link>
                  <Nav.Link id="users" style={{ cursor: 'auto' }}>
                    <button
                      onClick={() => navigate('/users')}
                      className={`website-navbar-button website-navbar-button-icon ${location.pathname === '/users' ? 'active' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                    >
                      <LiaUserLockSolid size={30} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>USUÁRIOS</div>
                    </button>
                  </Nav.Link>
                  <Nav.Link id='settings-aSerDesenvolvido' style={{ cursor: 'auto', display: 'none' }}>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id={'tooltip-bottom'}>Configurações</Tooltip>}>
                      <button
                        onClick={() => navigate('/settings')}
                        className={`website-navbar-button website-navbar-button-icon ${location.pathname === '/settings' ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                      >
                        <LiaCogSolid size={30} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>CONFIGURAÇÕES</div>
                      </button>
                    </OverlayTrigger>
                  </Nav.Link>
                </>}
                <div className="menu-direita">
                  <NavDropdown 
                    title={
                      <OverlayTrigger placement="bottom" overlay={<Tooltip id={'tooltip-bottom'}>Notificações</Tooltip>}>
                        <div className="website-navbar-action-exit website-navbar-button-icon">
                          <Badge pill bg="danger" >
                            3
                          </Badge>
                          <LiaBell size={30} />
                        </div>
                      </OverlayTrigger>
                    }
                    id="basic-nav-dropdown"
                    drop="down"
                    align="end"
                    className='no-caret'
                    style={{ display: 'none' }}
                  >
                    <NavDropdown.Item style={{ padding: '10px' }}>
                      Novo usuário cadastrado via formulário
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id={'tooltip-bottom'}>Sair</Tooltip>}>
                      <button onClick={handleExit} className="website-navbar-action-exit website-navbar-button-icon">
                        <LiaSignOutAltSolid size={30} />
                      </button>
                    </OverlayTrigger>
                  </Nav.Link>
                </div>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </Row>
  )
}
