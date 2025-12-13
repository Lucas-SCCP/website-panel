import { useEffect } from 'react'
import { Row, Col, Form, Alert } from 'react-bootstrap'
import { Main } from './Main'
import { LiaUserLockSolid } from 'react-icons/lia'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'

export function Users() {
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
                  <LiaUserLockSolid size={24} />
                  <b>GESTÃO DE USUÁRIOS</b>
                </div>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={3} className='pe-0'>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12} className='mb-2 text-center'>
                          <div style={{ background: 'var(--blue3)', borderRadius: '5px', padding: '5px' }}>
                            <b>CRIAR NOVO USUÁRIO</b>
                          </div>
                        </Col>
                        <Col lg={12} className='mb-2'>
                          <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '5px' }}>
                            <b>Lucas Rodrigues (lucas.2601@gmail.com)</b>
                          </div>
                        </Col>
                        <Col lg={12} className='mb-2'>
                          <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '5px' }}>
                            <b>Jéssica Fournier (jehfounier@gmail.com)</b>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg={9}>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={6}>
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="Nome do usuário" />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Sobrenome</Form.Label>
                                <Form.Control type="text" placeholder="Sobrenome do usuário" />
                              </Form.Group>
                            </Col>
                            <Col lg={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" placeholder="Email do usuário" />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Nível de acesso</Form.Label>
                                <Form.Select>
                                  <option>Administrador</option>
                                  <option>Editor</option>
                                  <option>Visualizador</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col lg={12}>
                              <Alert variant='info'>
                                Ao criar um novo usuário, ele receberá um email para definir a sua senha de acesso.
                              </Alert>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6}>
                          <Row>
                            <Col lg={12}>
                              Histórico
                            </Col>
                            <Col lg={12} style={{ fontSize: '14px', color: 'gray' }}>
                              05/12/2025 14:22 - Login realizado.<br />
                              01/12/2025 09:15 - Senha redefinida.<br />
                              30/11/2025 11:52 - Usuário criado.
                            </Col>
                          </Row>
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
