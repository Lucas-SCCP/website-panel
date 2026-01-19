import { useEffect, useState } from 'react'
import { Row, Col, Badge, ProgressBar, Spinner } from 'react-bootstrap'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import { LineCharts } from '../charts/LineCharts'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { GoGraph, GoEye, GoCloud } from "react-icons/go";
import { LiaGlobeAmericasSolid, LiaStar } from "react-icons/lia";
import type { DashboardType } from '../types/DashboardType'

export function Dashboard() {
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const websiteId = UseWebsiteStore((s) => s.selectedWebsiteId)
  const allWebsite = UseWebsiteStore((s) => s.allWebsites)
  const [dashboard, setDashboard] = useState<DashboardType | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(false)
  
  useEffect(() => {
    setSelectedPageId(null)
    if (websiteId !== null) {
      const fetchDashboardInfo = async () => {
        setLoadingPlan(true)
        setDashboard(null)
        const apiService = new ApiService()
        const dashboardInfo = await apiService.getDashboardInfoByWebsiteId(websiteId)
        setDashboard(dashboardInfo)
        setLoadingPlan(false)
      }
      fetchDashboardInfo()
    }  
  }, [setSelectedPageId, websiteId, allWebsite])

  return (
    <Main>
      <Row className="mt-3 mb-3" style={{ display: websiteId == null ? 'none' : 'flex' }}>
        <Col sm={12} md={12} lg={3}>
          <Row>
            <Col lg={12}>
              <div className="website-card" style={{ position: 'relative' }}>
                {loadingPlan && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 10,
                      borderRadius: '5px'
                    }}
                  >
                    <Spinner animation="border" variant="light" />
                  </div>
                )}
                <Row>
                  <Col lg={12} className="mb-2">
                    <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                      <LiaStar size={24} />
                      <b>MEU PLANO</b>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
                      <Row>
                        <Col lg={12}>
                          <b>Plano atual:</b> {dashboard?.plan.name} (R$ {dashboard?.plan.price})
                        </Col>
                        <Col lg={12}>
                          <b>Renovação:</b> {dashboard?.plan.endDate}
                        </Col>
                        <Col lg={12}>
                          <b>Forma de pagamento:</b> {dashboard?.plan.paymentType}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col lg={12} className='mt-3' style={{ display: 'none' }}>
              <div className="website-card">
                <Row>
                  <Col lg={12} className="mb-2">
                    <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                      <GoCloud size={24} />
                      <b>ARMAZENAMENTO</b>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
                      <Row>
                        <Col lg={12}>
                          <b>Espaço total:</b> 1 GB (60% utilizado)
                        </Col>
                        <Col lg={12} className='mt-3'>
                          <ProgressBar now={60} label={'60%'} />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>

        <Col sm={12} md={12} lg={3} className="mt-3 mt-md-0 ps-lg-0" style={{ display: 'none' }}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                  <GoEye size={24} />
                  <b>ANALYTICS</b>
                </div>
              </Col>
              <Col lg={12} className='text-center'>
                <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
                  <Row>
                    <Col lg={12} style={{ padding: '20px' }}>
                      <div style={{ background: '#EEE', padding: '20px', borderRadius: '5px' }}>
                        <div className='tiktok-sans fw-700' style={{ fontSize: '90px', lineHeight: '1em' }}>
                          45
                        </div>
                        <div>
                          <b>Visitas (24 horas):</b>
                        </div>
                      </div>
                    </Col>
                    <Col lg={12} className='mt-3'>
                      <div>
                        <b>Palavras mais utilizadas em busca:</b>
                      </div>
                      <div style={{ display: 'flex', fontSize: '20px', gap: '10px', padding: '10px', justifyContent: 'center' }}>
                        <Badge bg="primary">Palavras</Badge>
                        <Badge bg="primary">Teste</Badge>
                        <Badge bg="primary">Outras</Badge>
                        <Badge bg="primary">Coisas</Badge>
                      </div>
                    </Col>
                    <Col lg={12} className='mt-3'>
                      <div>
                        <b>Principal origem:</b>
                      </div>
                      <div>
                        Google
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col sm={12} md={12} lg={6} className="mt-3 mt-md-0 ps-lg-0" style={{ display: 'none' }}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                  <GoGraph size={24} />
                  <b>QUANTIDADE DE ACESSOS (7 DIAS)</b>
                </div>
              </Col>
              <Col lg={12}>
                <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
                  <LineCharts />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="mt-3 mb-3" style={{ display: websiteId == null ? 'flex' : 'none' }}>
        <Col
          lg={12}
           style={{
            padding: '50px',
            color: '#FFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <LiaGlobeAmericasSolid size={100} />
          <div className='tiktok-sans fw-700' style={{ fontSize: '40px' }}>
            SELECIONE UM SITE
          </div>
        </Col>
      </Row>
    </Main>
  )
}
