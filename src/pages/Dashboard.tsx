import { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Main } from './Main'
import { AreaCharts } from '../charts/AreaCharts'
import { BarCharts } from '../charts/BarCharts'
import { FaChartBar } from 'react-icons/fa'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'

export function Dashboard() {
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
                <div className="website-card-header tiktok-sans">
                  <FaChartBar size={18} />
                  <b>VISITANTES POR PÁGINA</b>
                </div>
              </Col>
              <Col lg={12}>
                <BarCharts />
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={12} md={12} lg={4} className="ps-0">
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans">
                  <FaChartBar size={18} />
                  <b>VISITANTES POR PERÍODO</b>
                </div>
              </Col>
              <Col lg={12}>
                <AreaCharts />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Main>
  )
}
