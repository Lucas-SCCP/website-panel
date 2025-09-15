import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Form, InputGroup, Image, Button, ProgressBar, OverlayTrigger, Tooltip, Alert, Dropdown } from 'react-bootstrap'
import Switch from 'react-switch'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import { Header, Footer } from 'website-lib'
import { GrConfigure } from 'react-icons/gr'
import { BsFillMenuButtonWideFill } from "react-icons/bs"
import { TbPlugConnectedX, TbBoxAlignTopFilled, TbBoxAlignBottomFilled } from "react-icons/tb"
import { IoFileTrayStacked } from "react-icons/io5"
import { MdOutlineHistory } from "react-icons/md"
import { RiBankLine } from "react-icons/ri"
import { FaFilePdf, FaFileImage, FaUsersGear } from "react-icons/fa6"
import { FaEnvelopeOpenText, FaInfoCircle } from 'react-icons/fa'
import { MdAddCircle } from 'react-icons/md';
import { ImExit } from "react-icons/im";
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import type { WebsiteType } from 'website-lib'
import type { NotificationType } from '../types/NotificationType'

export function Settings() {
  const navigate = useNavigate()
  const [website, setWebsite] = useState<WebsiteType | null>(null)
  const [selectedMenu, setSelectedMenu] = useState(1)
  const [selectedUser, setSelectedUser] = useState(0)
  const [newUser, setNewUser] = useState(false)
  const [selectedFileType, setSelectedFileType] = useState(0)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isDefaultSite, setIsDefaultSite] = useState(false)
  const [accessLevel, setAccessLevel] = useState('')
  // const [photo, setPhoto] = useState<File | null>(null)
  // const [isActive, setIsActive] = useState(false)

  const [notifications, setNotifications] = useState<NotificationType[]>([])

  const allWebsites = UseWebsiteStore((state) => state.allWebsites)
  const selectedWebsiteId = UseWebsiteStore((state) => state.selectedWebsiteId)
  const selectedPageId = UseWebsiteStore((state) => state.selectedPageId)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const { updateSelectedWebsiteField } = UseWebsiteStore()
  const setSelectedWebsiteId = UseWebsiteStore((state) => state.setSelectedWebsiteId)
  const setSelectedWebsite = UseWebsiteStore((state) => state.setSelectedWebsite)
  
  useEffect(() => {
    setSelectedPageId(null)
  }, [setSelectedPageId])

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
    setSelectedWebsiteId(null)
    setSelectedPageId(null)
    // setSelectedWebsite(null)
    navigate('/login')
  }

  const handleMenuClick = async (menuId: number) => {
    if (!selectedWebsiteId) {
      console.error('No website selected')
      return
    }

    const apiService = new ApiService()

    if (menuId === 9) {
      const notifications = await apiService.getNotificationByWebsiteId(selectedWebsiteId)
      setNotifications(notifications)
    }

    setSelectedMenu(menuId)
  }

  const handleUserClick = (userId: number) => {
    if (userId === 0) {
      setFirstName('')
      setLastName('')
      setEmail('')
      setIsDefaultSite(false)
      setAccessLevel('')
      setNewUser(true)
    } else {
      setFirstName('Lucas')
      setLastName('da Silva')
      setEmail('lucas@example.com')
      setIsDefaultSite(true)
      setAccessLevel('1')
      setNewUser(false)
    }
    setSelectedUser(userId)
  }

  const setValue = (key: keyof WebsiteType, value: boolean) => {
    if (website?.id == null) {
      return
    }
    updateSelectedWebsiteField(key, value)
  }

  const handleChangePassword = () => {
    alert('Função de alterar senha ainda não implementada.')
  }

  useEffect(() => {
    setSelectedMenu(1)
    const timeoutId = setTimeout(() => {
      const website = allWebsites.find((w) => w.id === selectedWebsiteId)
      if (website) {
        setWebsite(website)
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [allWebsites, selectedWebsiteId, selectedPageId])

  if (!website) {
    return (
      <Main>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <Row className="mt-3 mb-3">
        <Col sm={12} md={12} lg={3}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <BsFillMenuButtonWideFill size={18} />
                  <b>MENU</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2">
                <Dropdown>
                  <Dropdown.Toggle className='krona dropdown-website-select' variant="light" style={{ width: '100%', border: '3px solid #DDD' }}>
                      {selectedWebsiteId ? allWebsites.find((w) => w.id === selectedWebsiteId)?.name : 'Selecione um site'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='krona dropdown-website-select-item' style={{ width: '100%', border: '3px solid #DDD' }}>
                    {allWebsites.map((website) => (
                      <Dropdown.Item onClick={selectedWebsiteClick} id={website.id.toString()} key={website.id} active={website.id === selectedWebsiteId}>
                        {website.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col lg={12} className="mb-2">
                <div className={`website-settings-menu-item ${selectedMenu === 1 ? 'active' : ''}`} onClick={() => handleMenuClick(1)}>
                  <GrConfigure size={18} />
                  <b>Configurações gerais</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2" style={{ display: 'none' }} id='aSerDesenvolvido'>
                <div className={`website-settings-menu-item ${selectedMenu === 2 ? 'active' : ''}`} onClick={() => handleMenuClick(2)}>
                  <TbBoxAlignTopFilled size={18} />
                  <b>Configurações do cabeçalho</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2" style={{ display: 'none' }} id='aSerDesenvolvido'>
                <div className={`website-settings-menu-item ${selectedMenu === 3 ? 'active' : ''}`} onClick={() => handleMenuClick(3)}>
                  <TbBoxAlignBottomFilled size={18} />
                  <b>Configurações do rodapé</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2">
                <div className={`website-settings-menu-item ${selectedMenu === 9 ? 'active' : ''}`} onClick={() => handleMenuClick(9)}>
                  <FaEnvelopeOpenText size={18} />
                  <b>Formulários enviados</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 4 ? 'active' : ''}`} onClick={() => handleMenuClick(4)}>
                  <FaUsersGear size={18} />
                  <b>Gerenciar usuários</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 5 ? 'active' : ''}`}  onClick={() => handleMenuClick(5)}>
                  <TbPlugConnectedX size={18} />
                  <b>Integrações</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 6 ? 'active' : ''}`} onClick={() => handleMenuClick(6)}>
                  <IoFileTrayStacked size={18} />
                  <b>Meus arquivos</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 7 ? 'active' : ''}`} onClick={() => handleMenuClick(7)}>
                  <MdOutlineHistory size={18} />
                  <b>Histórico de alterações</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 8 ? 'active' : ''}`} onClick={() => handleMenuClick(8)}>
                  <RiBankLine size={18} />
                  <b>Meu plano</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2">
                <div className={`website-settings-menu-item ${selectedMenu === 8 ? 'active' : ''}`} onClick={() => handleExit()}>
                  <ImExit size={18} />
                  <b>Sair</b>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={12} md={12} lg={9} className="ps-md-0 mt-md-0 mt-3">
          <div id='websiteSettings' className="website-card" style={{ display: selectedMenu === 1 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <GrConfigure size={18} />
                  <b>CONFIGURAÇÕES GERAIS</b>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Row>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Nome</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.name} />
                    </InputGroup>
                  </Col>
                  <Col lg={6}>
                    <Form.Label htmlFor="basic-url">Endereço</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.domain} readOnly />
                    </InputGroup>
                  </Col>
                  <Col lg={6}>
                    <Form.Label htmlFor="basic-url">Endereço de homologação</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.domainStage} readOnly />
                    </InputGroup>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">E-mail de notificação</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
                  </Col>
                  <Col lg={12} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <div className='website-card-header krona mb-2'>
                      REDES SOCIAIS
                    </div>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">Instagram</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.properties.social.instagram.path} />
                    </InputGroup>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">Facebook</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.properties.social.facebook.path} />
                    </InputGroup>
                  </Col>
                  <Col lg={12} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <div className='website-card-header krona mb-2'>
                      ESTILO
                    </div>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">Cor padrão do texto</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.styles.color} />
                    </InputGroup>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">Cor de fundo</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.styles.backgroundColor} />
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
              <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                <Row>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Logo</Form.Label>
                    <InputGroup className="mb-3">
                      <Image
                        src={`https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/${website?.logo}`}
                        style={{ objectFit: 'cover', maxWidth: '250px' }}
                      />
                    </InputGroup>
                  </Col>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Imagem de fundo</Form.Label>
                    <InputGroup className="mb-3">
                      <Image
                        src={website.styles.backgroundImage}
                        style={{ objectFit: 'cover', maxWidth: '500px' }}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div id='headerSettings' className="website-card" style={{ display: selectedMenu === 2 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <TbBoxAlignTopFilled size={18} />
                  <b>CONFIGURAÇÕES DO CABEÇALHO</b>
                </div>
              </Col>
              <Col lg={6}>
                <div style={{ minHeight: '300px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  <Row>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        LOGO
                      </div>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="componentEnabledSwitch">
                        <Form.Label>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Exibir
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-component-enabled">Exibir a logo no cabeçalho do site.</Tooltip>
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
                            onChange={(checked) => setValue('header', checked)}
                            checked={!!website.header.properties.showLogo}
                            className="react-switch"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Alinhamento</Form.Label>
                        <Form.Select aria-label="Selecione">
                          <option value="">Selecione</option>
                          <option value="1">Esquerda</option>
                          <option value="2">Centro</option>
                          <option value="3">Direita</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        ESTILO
                      </div>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Cor de fundo</Form.Label>
                        <Form.Control
                          type="color"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={6} className='ps-0'>
                <div style={{ minHeight: '300px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  <Col lg={12}>
                    <div className='website-card-header krona mb-2'>
                      MENU
                    </div>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mb-3" controlId="componentEnabledSwitch">
                      <Form.Label>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          Exibir
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="tooltip-component-enabled">Exibir o menu no cabeçalho do site.</Tooltip>
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
                          onChange={(checked) => setValue('header', checked)}
                          checked={false}
                          className="react-switch"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg={12}>
                    <div className='website-card-header krona mb-2'>
                      ESTILO
                    </div>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mb-3" controlId="pageName">
                      <Form.Label>Cor de fundo</Form.Label>
                      <Form.Control
                        type="color"
                      />
                    </Form.Group>
                  </Col>
                </div>
              </Col>
              <Col lg={12} className='mt-3'>
                <b>Pré-visualização do cabeçalho:</b>
              </Col>
              <Col lg={12} className='mt-2'>
                <Header website={website} />
              </Col>
            </Row>
          </div>
          <div id='footerSettings' className="website-card" style={{ display: selectedMenu === 3 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <TbBoxAlignBottomFilled size={18} />
                  <b>CONFIGURAÇÕES DO RODAPÉ</b>
                </div>
              </Col>
              <Col lg={6}>
                <div style={{ minHeight: '300px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  <Row>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        INFORMAÇÕES
                      </div>
                    </Col>
                    <Col lg={2}>
                      <Form.Group className="mb-3" controlId="componentEnabledSwitch">
                        <Form.Label>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Exibir
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-component-enabled">Exibir a logo no cabeçalho do site.</Tooltip>
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
                            onChange={(checked) => setValue('header', checked)}
                            checked={!!website.header.properties.showLogo}
                            className="react-switch"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Texto</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        ESTILO
                      </div>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Cor de fundo</Form.Label>
                        <Form.Control
                          type="color"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={6} className='ps-0'>
                <div style={{ minHeight: '300px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  <Row>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        ÍCONES SOCIAIS
                      </div>
                    </Col>
                    <Col lg={2}>
                      <Form.Group className="mb-3" controlId="componentEnabledSwitch">
                        <Form.Label>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Exibir
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-component-enabled">Exibir o menu no cabeçalho do site.</Tooltip>
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
                            onChange={(checked) => setValue('header', checked)}
                            checked={false}
                            className="react-switch"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Alinhamento</Form.Label>
                        <Form.Select aria-label="Selecione">
                          <option value="">Selecione</option>
                          <option value="1">Esquerda</option>
                          <option value="2">Centro</option>
                          <option value="3">Direita</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        ESTILO
                      </div>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Cor do ícone</Form.Label>
                        <Form.Control
                          type="color"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={12} className='mt-3'>
                <b>Pré-visualização do rodapé:</b>
              </Col>
              <Col lg={12} className='mt-2'>
                <Footer website={website} />
              </Col>
            </Row>
          </div>
          <div id='websiteSettings' className="website-card" style={{ display: selectedMenu === 9 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <FaEnvelopeOpenText size={18} />
                  <b>FORMULÁRIOS ENVIADOS</b>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={{ border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  {notifications.map((notification, index) => (
                    <Row key={index} className='notification-item'>
                      <Col lg={2}>
                        <div className='notification-date' style={{  }}>
                          {notification.created_at && (
                            <Row className="text-center">
                              <Col lg={12}>
                                {new Date(
                                  new Date(notification.created_at).getTime() - 3 * 60 * 60 * 1000
                                ).toLocaleDateString('pt-BR')}
                              </Col>
                              <Col lg={12}>
                                {new Date(
                                  new Date(notification.created_at).getTime() - 3 * 60 * 60 * 1000
                                ).toLocaleTimeString('pt-BR')}
                              </Col>
                            </Row>
                          )}
                        </div>
                      </Col>
                      <Col lg={10}>
                        <div key={index} style={{ fontSize: '18px', whiteSpace: 'pre-line', padding: '10px' }}>
                          {JSON.parse(notification.message).message.split('\n').map((line: string, i: number) => {
                            const regexLink = /(https?:\/\/[^\s]+)/g;
                            const textoComLinks = line.replace(regexLink, '<a href="$1" target="_blank">Visualizar</a>');

                            return (<div dangerouslySetInnerHTML={{ __html: textoComLinks }} key={i} />)
                          })}
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
          <div id='userManagement' className="website-card" style={{ display: selectedMenu === 4 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <FaUsersGear size={18} />
                  <b>GERENCIAR USUÁRIOS</b>
                </div>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={5}>
                    <div className={`website-settings-menu-item mb-2 ${selectedUser === 1 ? 'active' : ''}`} onClick={() => handleUserClick(1)}>
                      <div>
                        <Image src="./public/user_avatar.png" rounded style={{ maxWidth: '50px', height: 'auto' }}/>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>Lucas da Silva</span>
                        <span style={{ fontSize: '14px', color: '#888888', fontWeight: 'bold' }}>lucas.2601@gmail.com</span>
                      </div>
                    </div>

                    <div className={`website-settings-menu-item mb-2`} onClick={() => handleUserClick(0)}
                      style={{ border: '3px dashed #EEE', color: '#888888', justifyContent: 'center', fontWeight: 'bold' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}><MdAddCircle /> Criar novo usuário</span>
                      </div>
                    </div>
                  </Col>
                  <Col lg={7} style={{ display: selectedUser !== 0 || newUser ? 'block' : 'none' }}>
                    <div className='mb-2' style={{ display: 'flex', gap: '10px', border: '3px solid #EEEEEE', padding: '10px', borderRadius: '5px' }}>
                      <Row>
                        <Col lg={6}>
                          <Row>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Nome</Form.Label>
                              <InputGroup className="mb-2">
                                <Form.Control id="basic-url" aria-describedby="basic-addon3" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                              </InputGroup>
                            </Col>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Sobrenome</Form.Label>
                              <InputGroup className="mb-2">
                                <Form.Control id="basic-url" aria-describedby="basic-addon3" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                              </InputGroup>
                            </Col>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Email</Form.Label>
                              <InputGroup className="mb-2">
                                <Form.Control id="basic-url" aria-describedby="basic-addon3" readOnly={!newUser} value={email} onChange={(e) => setEmail(e.target.value)} />
                              </InputGroup>
                            </Col>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Nível de acesso</Form.Label>
                              <Form.Select aria-label="Selecione" className="mb-2" value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="1">Administrador</option>
                                <option value="2">Editor</option>
                                <option value="3">Analista</option>
                                <option value="4">Colaborador</option>
                                <option value="5">Visualizador</option>
                              </Form.Select>
                            </Col>
                            <Col lg={6}>
                              <Form.Label htmlFor="basic-url">Site padrão</Form.Label>
                              <Form.Select aria-label="Selecione" value={isDefaultSite ? "1" : "2"} onChange={(e) => setIsDefaultSite(e.target.value === "1")}>
                                <option value="">Selecione</option>
                                <option value="1">Sim</option>
                                <option value="2">Não</option>
                              </Form.Select>
                            </Col>
                            <Col lg={6}>
                              <Form.Label htmlFor="basic-url">Ativo</Form.Label>
                              <Form.Select aria-label="Selecione" value='false'>
                                <option value="">Selecione</option>
                                <option value="1">Sim</option>
                                <option value="2">Não</option>
                              </Form.Select>
                            </Col>
                            <Col lg={12} className='mt-3'>
                              <Alert variant='warning' style={{ display: selectedUser === 1 ? 'none' : 'block' }}>
                                Ao criar um usuário, ele receberá um e-mail para definir a senha de acesso.
                              </Alert>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6}>
                          <Row>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Foto</Form.Label>
                              <InputGroup className="mb-2 text-center" style={{ justifyContent: 'center' }}>
                                <Image src="./public/user_avatar.png" rounded style={{ maxWidth: '100%', height: 'auto' }}/>
                              </InputGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={12}>
                          <Button variant="success" className='me-2'>Salvar</Button>
                          <Button variant='outline-secondary' className='me-2' onClick={() => handleChangePassword()} style={{ display: newUser ? 'none' : '' }}>
                            Alterar senha
                          </Button>
                          <Button variant="danger" style={{ display: newUser ? 'none' : '' }}>
                            Excluir
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div id='integrationSettings' className="website-card" style={{ display: selectedMenu === 5 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <TbPlugConnectedX size={18} />
                  <b>INTEGRAÇÕES</b>
                </div>
              </Col>
              <Col lg={12}>
                Google Analytics
              </Col>
            </Row>
          </div>
          <div id='fileManagement' className="website-card" style={{ display: selectedMenu === 6 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <IoFileTrayStacked size={18} />
                  <b>MEUS ARQUIVOS</b>
                </div>
              </Col>
              <Col lg={5}>
                <Row>
                  <Col lg={12} className='mt-2 mb-2'>
                    <b>Espaço utilizado:</b> 95% (4.75 GB de 5 GB)
                  </Col>
                  <Col lg={12} className='mb-3'>
                    <ProgressBar>
                      <ProgressBar striped variant="success" now={70} key={1} />
                      <ProgressBar striped variant="warning" now={20} key={2} />
                      <ProgressBar striped variant="danger" now={5} key={3} />
                    </ProgressBar>
                  </Col>
                  <Col lg={12} className='mb-2'>
                    <b>Arquivos:</b>
                  </Col>
                  <Col lg={12}>
                    <div className={`website-settings-menu-item mb-2 ${selectedFileType === 1 ? 'active' : ''}`} onClick={() => setSelectedFileType(1)}>
                      <div>
                        <FaFilePdf />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span>
                          <b>PDF</b>
                        </span>
                        <span style={{ marginLeft: 'auto' }}>
                          4 / 3.27 Gb
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className={`website-settings-menu-item mb-2 ${selectedFileType === 2 ? 'active' : ''}`} onClick={() => setSelectedFileType(2)}>
                      <div>
                        <FaFileImage />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span>
                          <b>Imagens</b>
                        </span>
                        <span style={{ marginLeft: 'auto' }}>
                          2 / 2.55 Gb
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg={7} className='text-center'>
                <div style={{ minHeight: '400px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px', display: selectedFileType === 1 ? 'block' : 'none' }}>
                  <Row>
                    <Col lg={3}>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <FaFilePdf size={40} />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="#" target='_blank'>CT_CleanFoods.pdf</a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={3} className='ps-0'>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <FaFilePdf size={40} />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="#" target='_blank'>CT_CleanFoods1.pdf</a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={3} className='ps-0'>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <FaFilePdf size={40} />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="#" target='_blank'>CT_CleanFoods2.pdf</a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={3} className='ps-0'>
                      <div style={{ border: '2px solid #fabdbdff', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <FaFilePdf size={40} />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="#" target='_blank'>CT_CleanFoods3.pdf</a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div style={{ minHeight: '400px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px', display: selectedFileType === 2 ? 'block' : 'none' }}>
                  <Row>
                    <Col lg={3}>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <Image
                              src="https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/logo_ctcleanfoods.png"
                              style={{ objectFit: 'cover', maxWidth: '150px' }}
                            />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/logo_ctcleanfoods.png" target='_blank'>
                              logo_ctcleanfoods.png
                            </a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={3} className='ps-0'>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <Image
                              src="https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/background_ctcleanfoods.png"
                              style={{ objectFit: 'cover', maxWidth: '150px' }}
                            />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/background_ctcleanfoods.png" target='_blank'>
                              background_ctcleanfoods.png
                            </a>
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            1.05 Mb
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div id='changeHistory' className="website-card" style={{ display: selectedMenu === 7 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <MdOutlineHistory size={18} />
                  <b>HISTÓRICO DE ALTERAÇÕES</b>
                </div>
              </Col>
            </Row>
          </div>
          <div id='planSettings' className="website-card" style={{ display: selectedMenu === 8 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <RiBankLine size={18} />
                  <b>MEU PLANO</b>
                </div>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor="basic-url">Plano</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor="basic-url">Início</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor="basic-url">Fim</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor="basic-url">Histórico de pagamentos</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Main>
  )
}
