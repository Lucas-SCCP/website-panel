import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Form, OverlayTrigger, Tooltip, Accordion } from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { Main } from './Main'
import { ComponentSettings } from '../components/ComponentSettings'
import { WebsitePreview } from '../components/WebsitePreview'
import { FaInfoCircle } from 'react-icons/fa'
import { LuLayoutDashboard } from 'react-icons/lu'
import { GrConfigure } from 'react-icons/gr'
import type { PageType } from 'website-lib'

export function Pages() {
  const navigate = useNavigate()

  const [name, setName] = useState<string | undefined>()
  const [title, setTitle] = useState<string | undefined>()
  const [path, setPath] = useState<string | undefined>()
  const [menu, setMenu] = useState<number | undefined>()
  const [menuOrder, setMenuOrder] = useState<number | undefined>()
  const [enabled, setEnabled] = useState<boolean | undefined>()

  const selectedWebsite = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)

  useEffect(() => {
    if (selectedPage) {
      setName(selectedPage.name)
      setTitle(selectedPage.title)
      setPath(selectedPage.path)
      setMenu(selectedPage.menu)
      setMenuOrder(selectedPage.menu_order)
      setEnabled(selectedPage.enabled)
    }
  }, [selectedPage])

  if (!selectedWebsite) {
    navigate('/')
  }

  if (!selectedPage) {
    console.log('Paginas nao carregaram')
    return null
  }

  function setCheckedPage(checked: boolean): void {
    if (checked) {
      setPath('/')
    }
  }

  function setCheckedMenu(checked: boolean): void {
    setMenu(checked ? 1 : 0)
  }

  function setCheckedInitialPage(checked: boolean): void {
    setEnabled(checked)
  }

  return (
    <Main>
      <Row className="mt-3 mb-3">
        <Col sm={12} md={12} lg={4}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0" className="mb-3 website-accordion-header-border-radius">
              <Accordion.Header className="website-accordion-header-border-radius">
                <div className="krona website-accordion-header">
                  <GrConfigure size={18} />
                  <b>CONFIGURAÇÕES DA PÁGINA</b>
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
                        onChange={(e) => setName(e.target.value)}
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
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="initialPageSwitch">
                      <Form.Check
                        type="switch"
                        checked={path === '/'}
                        onChange={(e) => setCheckedPage(e.target.checked)}
                        id="initialPageSwitch"
                        label={
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
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="menuSwitch">
                      <Form.Check
                        type="switch"
                        checked={menu === 1}
                        onChange={(e) => setCheckedMenu(e.target.checked)}
                        id="menuSwitch"
                        label={
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Exibir no menu
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-initial-page">
                                  Ative para exibir essa página no menu de navegação do site.
                                </Tooltip>
                              }
                            >
                              <span style={{ cursor: 'pointer', color: '#A1A1A1' }}>
                                <FaInfoCircle size={14} />
                              </span>
                            </OverlayTrigger>
                          </span>
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="enabledSwitch">
                      <Form.Check
                        type="switch"
                        checked={enabled}
                        onChange={(e) => setCheckedInitialPage(e.target.checked)}
                        id="enabledSwitch"
                        label={
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Visível
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-initial-page">Ative para publicar essa página no site.</Tooltip>
                              }
                            >
                              <span style={{ cursor: 'pointer', color: '#A1A1A1' }}>
                                <FaInfoCircle size={14} />
                              </span>
                            </OverlayTrigger>
                          </span>
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group controlId="positionMenu">
                      <Form.Label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Posição no menu
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
                      <Form.Control type="number" value={menuOrder} />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" className="mb-3 website-accordion-header-border-radius">
              <Accordion.Header className="website-accordion-header-border-radius">
                <div className="krona website-accordion-header">
                  <LuLayoutDashboard size={18} />
                  <b>COMPONENTES DA PÁGINA</b>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Accordion>
                  {selectedPage.components.map((component, index) => (
                    <ComponentSettings {...component} key={index} index={index} />
                  ))}
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col sm={12} md={12} lg={8} className="ps-0">
          <WebsitePreview {...selectedPage} />
        </Col>
      </Row>
    </Main>
  )
}
