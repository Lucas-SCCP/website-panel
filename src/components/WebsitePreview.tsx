import { useState } from 'react'
import { Row, Col, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { Header, Footer, PageRenderer } from 'website-lib'
import { FaSearchPlus } from 'react-icons/fa'
import { MdOutlineFindInPage } from 'react-icons/md'
import type { WebsiteType, PageType } from 'website-lib'

export function WebsitePreview() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)

  console.log('Selected website in WebsitePreview:', selectedWebsite)
  console.log('Selected page in WebsitePreview:', selectedPage)

  return (
    <>
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
          <div style={{ border: '2px solid #BBBBBB', borderRadius: '5px' }}>
            {selectedWebsite && selectedPage && (
              <PageRenderer website={selectedWebsite} page={selectedPage} editionMode={true} />
            )}
          </div>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Pré visualização da página</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWebsite && selectedPage && (
            <>
              <Header website={selectedWebsite} />
              <PageRenderer website={selectedWebsite} page={selectedPage} editionMode={true} />
              <Footer website={selectedWebsite} />
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
