import { useEffect, useState } from 'react'
import { Row, Col, Form, OverlayTrigger, Tooltip, Accordion } from 'react-bootstrap'
import Switch from 'react-switch'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { Main } from './Main'
import { ComponentSettings } from '../components/ComponentSettings'
import { WebsitePreview } from '../components/WebsitePreview'
import { FaInfoCircle } from 'react-icons/fa'
import { LuLayoutDashboard } from 'react-icons/lu'
import { GrConfigure } from 'react-icons/gr'
import type { PageType } from 'website-lib'

export function Pages() {
  const [name, setName] = useState<string | undefined>()
  const [title, setTitle] = useState<string | undefined>()
  const [path, setPath] = useState<string | undefined>()
  const [menu, setMenu] = useState<number | undefined>()
  const [menuOrder, setMenuOrder] = useState<number | undefined>()
  const [enabled, setEnabled] = useState<boolean | undefined>()
  const [page, setPage] = useState<PageType | null>(null)
 
  const allWebsites = UseWebsiteStore((state) => state.allWebsites)
  const selectedWebsiteId = UseWebsiteStore((state) => state.selectedWebsiteId)
  const selectedPageId = UseWebsiteStore((state) => state.selectedPageId)
  
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
    updateSelectedPageField('menu_order', newMenuOrder)
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

  useEffect(() => {
    console.log('PAGE')
    const timeoutId = setTimeout(() => {
      const website = allWebsites.find((w) => w.id === selectedWebsiteId)
      console.log('Selected website:', website)
      if (website) {
        const page = website.pages.find((p) => p.id === selectedPageId)
        console.log('Selected page:', page)
        if (page) {
          setPage(page)
          setName(page.name)
          setTitle(page.title)
          setPath(page.path)
          setMenu(page.menu)
          setMenuOrder(page.menu_order)
          // Garantir que sempre trabalhamos com boolean na interface
          setEnabled(!!page.enabled)
        }
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [allWebsites, selectedWebsiteId, selectedPageId])

  if (!page) {
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
                      <Form.Control type="number" value={menuOrder} onChange={(e) => handleMenuOrderChange(parseInt(e.target.value) || 0)}/>
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
                  {page.components.map((component, index) => (
                    <ComponentSettings component={component} key={index} index={index} />
                  ))}
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col sm={12} md={12} lg={8} className="ps-0">
          <WebsitePreview />
        </Col>
      </Row>
    </Main>
  )
}
