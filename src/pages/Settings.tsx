import { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Main } from './Main'
import { GrConfigure } from 'react-icons/gr'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'

export function Settings() {
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  
  useEffect(() => {
    setSelectedPageId(null)
  }, [setSelectedPageId])

  return (
    <Main>
      <Row className="mt-3 mb-3">
        <Col sm={12} md={12} lg={4}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <GrConfigure size={18} />
                  <b>CONFIGURAÇÕES DO SITE</b>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={12} md={12} lg={4} className="ps-0">
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <GrConfigure size={18} />
                  <b>CONFIGURAÇÕES DE USUÁRIOS</b>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={12} md={12} lg={4} className="ps-0">
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <GrConfigure size={18} />
                  <b></b>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Main>
  )
}
