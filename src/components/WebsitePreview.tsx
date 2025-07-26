import { useState } from 'react'
import { Container, Row, Col, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { PageRenderer } from 'website-lib'
import { FaSearchPlus } from 'react-icons/fa'
import { MdOutlineFindInPage } from 'react-icons/md'
import type { PageType, ComponentType, WebsiteType } from 'website-lib'

export function WebsitePreview() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getWebsiteData: WebsiteType[] = UseWebsiteStore((state) => state.data)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)

  console.log('WebsitePreview selectedPage', selectedPage)

  const components = selectedPage?.components as ComponentType[]

  console.log('WebsitePreview components', components)
  console.log('WebsitePreview all sites', getWebsiteData)

  return (
    <>
      <style>
        {`
          .root {
            margin: 0 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            background-color: #000 !important;
          }

          .background-image {
            background-image: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/src/assets/images/background_ctcleanfoods.png') !important;
            background-size: contain !important;
            background-position: top !important;
            width: 100% !important;
          }

          .is-invalid {
            border: 3px solid red !important;
          }

          .in-dev {
            background-color: #000000 !important;
          }

          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace !important;
          }

          .cor-primaria {
            background-color: #FFCC00 !important;
            border-color:  #FFCC00 !important;
            color: #000 !important;
          }

          .border-primaria {
            border-color:  #FFCC00;
          }

          .texto-primaria {
            color:  #FFCC00 !important;
          }

          .centralizar {
            min-height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: calc(10px + 2vmin) !important;
            color: black !important;
          }

          .menu .dropdown-toggle {
            color: #FFF !important;
          }

          .destaque {
            padding: 50px !important;
            border: 3px solid !important;
            background: #1b1b1b !important;
            color: white !important;
            text-align: center !important;
          }

          .form-contact {
            padding: 50px !important;
          }

          .itens {
            padding: 50px !important;
          }

          .itens-text {
            font-size: 22px !important;
          }
        `}
      </style>
      <Row>
        <Col lg={12} className="mb-3">
          <div
            className="krona"
            style={{
              backgroundColor: '#FFF',
              borderRadius: '5px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdOutlineFindInPage size={18} />
              <b>PRÉ-VISUALIZAÇÃO DA PÁGINA</b>
            </div>
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip id="tooltip-initial-page">Visualizar a página em tela cheia</Tooltip>}
            >
              <div onClick={handleShow} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <span onClick={handleShow}>
                  <FaSearchPlus size={20} />
                </span>
              </div>
            </OverlayTrigger>
          </div>
        </Col>
        <Col lg={12}>
          <main className="root background-image" style={{ borderRadius: '5px' }}>
            <Container>
              <PageRenderer ga4="T" title="" components={components} />
            </Container>
          </main>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Pré visualização da página</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <main className="root background-image">
            <Container>
              <PageRenderer ga4="T" title="" components={components} />
            </Container>
          </main>
        </Modal.Body>
      </Modal>
    </>
  )
}
