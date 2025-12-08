import { useEffect, useState } from 'react'
import { Row, Col, Badge, ProgressBar } from 'react-bootstrap'
import { Main } from './Main'
import { LineCharts } from '../charts/LineCharts'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { GoStar, GoGraph, GoEye, GoCloud } from "react-icons/go";
import type { WebsiteType } from 'website-lib'

export function Dashboard() {
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const websiteId = UseWebsiteStore((s) => s.selectedWebsiteId)
  const allWebsite = UseWebsiteStore((s) => s.allWebsites)
  const [websiteSelected, setWebsiteSelected] = useState<WebsiteType | null>(null)
  
  useEffect(() => {
    setSelectedPageId(null)
    if (websiteId !== null) {
      console.log('All website', allWebsite)
      const selected = allWebsite.find(w => w.id === websiteId)
      console.log('Website Selected', selected)
      setWebsiteSelected(selected || null)
    }  
  }, [setSelectedPageId, websiteId, allWebsite])

  return (
    <Main>
      <Row className="mt-3 mb-3" style={{ display: websiteId == null ? 'none' : 'flex' }}>
        <Col sm={12} md={12} lg={3}>
          <Row>
            <Col lg={12}>
              <div className="website-card">
                <Row>
                  <Col lg={12} className="mb-2">
                    <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                      <GoStar size={24} />
                      <b>MEU PLANO</b>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
                      <Row>
                        <Col lg={12}>
                          <b>Plano atual:</b> Teste {websiteSelected?.id} (R$ 9,90)
                        </Col>
                        <Col lg={12}>
                          <b>Renovação:</b> 12/12/2022
                        </Col>
                        <Col lg={12}>
                          <b>Forma de pagamento:</b> Pix
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col lg={12} className='mt-3'>
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

        <Col sm={12} md={12} lg={3} className="ps-0">
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

        <Col sm={12} md={12} lg={6} className="ps-0">
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
          <div className='tiktok-sans fw-700' style={{ fontSize: '40px' }}>
            SELECIONE UM SITE
          </div>
        </Col>
      </Row>
    </Main>
  )
}
