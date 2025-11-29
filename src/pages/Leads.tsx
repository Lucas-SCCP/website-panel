import { useEffect } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { Main } from './Main'
import { IoIosPeople } from 'react-icons/io'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { MdDeleteForever } from 'react-icons/md'

export function Leads() {
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  
  useEffect(() => {
    setSelectedPageId(null)
  }, [setSelectedPageId])
  
  const leads = [
    {
      id: '001',
      date: '20/11/2024 13:45',
      name: 'Lucas Rodrigues',
      phone: '(14) 98811-6576',
      email: 'lucas.rodrigues@example.com'
    },
    {
      id: '002',
      date: '20/11/2024 16:20',
      name: 'Bob Marley',
      phone: '(14) 98822-4200',
      email: 'bob.marley@example.com'
    }
  ]

  return (
    <Main>
      <Row className="mt-3 mb-3">
        <Col sm={12} md={12} lg={12}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans">
                  <IoIosPeople size={24} />
                  <b>GESTÃO DE LEADS</b>
                </div>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={3} className='pe-0'>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12} className='mb-3 text-center'>
                          <div style={{ background: 'var(--blue3)', borderRadius: '5px', padding: '5px' }}>
                            <b>FILTROS</b>
                          </div>
                        </Col>
                        <Col lg={12}>
                          <Form.Select className='mb-3' aria-label="Default select example">
                            <option>Todos os formulários</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </Form.Select>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3">
                            <Form.Control type="email" placeholder="Pesquisar pelo nome" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3">
                            <Form.Control type="email" placeholder="Pesquisar pelo email" />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg={9}>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12}>
                          <div style={{ background: 'var(--blue3)', borderRadius: '5px 5px', padding: '5px' }}>
                            <Row>
                              <Col lg={2} style={{ borderRight: '1px solid var(--blue1)' }}>
                                <b>DATA DE REGISTRO</b>
                              </Col>
                              <Col lg={4} style={{ borderRight: '1px solid var(--blue1)' }}>
                                <b>NOME</b>
                              </Col>
                              <Col lg={2} style={{ borderRight: '1px solid var(--blue1)' }}>
                                <b>TELEFONE</b>
                              </Col>
                              <Col lg={3} style={{ borderRight: '1px solid var(--blue1)' }}>
                                <b>E-MAIL</b>
                              </Col>
                              <Col lg={1} className='text-center'>
                                <b>EXCLUIR</b>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col lg={12} className='mb-3'>
                          <div style={{ borderRadius: '0px 0px 5px 5px', padding: '5px' }}>
                            {leads.map((lead) => (
                              <Row key={lead.id} className='align-items-center mb-2'>
                                <Col lg={2} style={{ borderRight: '1px solid var(--blue1)' }}>
                                  {lead.date}
                                </Col>
                                <Col lg={4} style={{ borderRight: '1px solid var(--blue1)' }}>
                                  {lead.name}
                                </Col>
                                <Col lg={2} style={{ borderRight: '1px solid var(--blue1)' }}>
                                  {lead.phone}
                                </Col>
                                <Col lg={3} style={{ borderRight: '1px solid var(--blue1)' }}>
                                  {lead.email}
                                </Col>
                                <Col lg={1} className='text-center'>
                                  <div style={{ cursor: 'pointer' }}>
                                    <MdDeleteForever size={20} color="red" />
                                  </div>
                                </Col>
                              </Row>
                            ))}
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
