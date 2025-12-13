import { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Main } from './Main'
import { LiaBookSolid } from 'react-icons/lia'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'

export function Posts() {
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  
  useEffect(() => {
    setSelectedPageId(null)
  }, [setSelectedPageId])

  return (
    <Main>
      <Row className="mt-3 mb-3">
        <Col sm={12} md={12} lg={12}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                  <LiaBookSolid size={24} />
                  <b>GESTÃO DE POSTS</b>
                </div>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={3} className='pe-0'>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12} className='mb-2 text-center'>
                          <div style={{ background: 'var(--blue3)', borderRadius: '5px', padding: '5px' }}>
                            <b>CRIAR NOVO POST</b>
                          </div>
                        </Col>
                        <Col lg={12} className='mb-2'>
                          <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '5px' }}>
                            <b>Teste de título post</b>
                          </div>
                        </Col>
                        <Col lg={12} className='mb-2'>
                          <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '5px' }}>
                            <b>Só mais um teste de título para um post</b>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg={9}>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col>
                          <div contentEditable>
                            Teste
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Main>
  )
}
