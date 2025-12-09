import { useEffect, useState, useMemo } from 'react'
import { Row, Col, Form, Pagination } from 'react-bootstrap'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import { GoPeople, GoTrash, GoSearch, GoCalendar, GoPerson } from "react-icons/go";
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import type { FormsType } from '../types/FormsType'
import type { LeadsType } from '../types/LeadsType';

export function Leads() {
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const websiteId = UseWebsiteStore((s) => s.selectedWebsiteId)

  const [forms, setForms] = useState<FormsType[]>([])
  const [leads, setLeads] = useState<LeadsType[]>([])

  const [selectedFormId, setSelectedFormId] = useState<'all' | string>('all')
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  useEffect(() => {
    setSelectedPageId(null)

    if (websiteId !== null) {
      const fetchDashboardInfo = async () => {
        const apiService = new ApiService()
        const formsData = await apiService.getFormsByWebsiteId(websiteId)
        setForms(Array.isArray(formsData) ? formsData : [formsData])

        const leadsData = await apiService.getLeadsByWebsiteId(websiteId)
        setLeads(Array.isArray(leadsData) ? leadsData : [leadsData])
      }
      fetchDashboardInfo()
    }
  }, [setSelectedPageId, websiteId])

  const filteredLeads = useMemo(() => {
    const searchNameLower = searchName.toLowerCase()
    const searchEmailLower = searchEmail.toLowerCase()

    return leads.filter((lead) => {
      // Filtro por formulário (assumindo que lead.formId exista)
      if (selectedFormId !== 'all' && String(lead.formId) !== selectedFormId) {
        return false
      }

      // Filtro por nome
      if (searchNameLower && !lead.firstName?.toLowerCase().includes(searchNameLower)) {
        return false
      }

      // Filtro por e-mail
      if (searchEmailLower && !lead.email?.toLowerCase().includes(searchEmailLower)) {
        return false
      }

      return true
    })
  }, [leads, selectedFormId, searchName, searchEmail])

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredLeads.slice(startIndex, endIndex)
  }, [filteredLeads, currentPage, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedFormId, searchName, searchEmail])

  return (
    <Main>
      <Row className="mt-3 mb-3">
        <Col sm={12} md={12} lg={12}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                  <GoPeople size={24} />
                  <b>GESTÃO DE LEADS</b>
                </div>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={3} className='pe-0'>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12} className='mb-3'>
                          <div style={{ background: 'var(--blue3)', borderRadius: '5px', padding: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <GoSearch />
                            <b>FILTROS</b>
                          </div>
                        </Col>
                        <Col lg={12}>
                          <Form.Select
                            className='mb-3'
                            aria-label="Filtrar por formulário"
                            value={selectedFormId}
                            onChange={(e) => setSelectedFormId(e.target.value)}
                          >
                            <option value="all">Todos os formulários</option>
                            {forms.map((form) => (
                              <option key={form.id} value={String(form.id)}>
                                {form.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder="Pesquisar pelo nome"
                              value={searchName}
                              onChange={(e) => setSearchName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder="Pesquisar pelo e-mail"
                              value={searchEmail}
                              onChange={(e) => setSearchEmail(e.target.value)}
                            />
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
                              <Col lg={2} style={{ borderRight: '1px solid var(--blue1)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <GoCalendar />
                                <b>DATA DE REGISTRO</b>
                              </Col>
                              <Col lg={4} style={{ borderRight: '1px solid var(--blue1)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <GoPerson />
                                <b>NOME</b>
                              </Col>
                              <Col lg={2} style={{ borderRight: '1px solid var(--blue1)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <b>TELEFONE</b>
                              </Col>
                              <Col lg={4} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <b>E-MAIL</b>
                              </Col>
                              <Col lg={1} style={{ display: 'none', alignItems: 'center', gap: '5px' }}>
                                <b>EXCLUIR</b>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col lg={12} className='mb-3'>
                          <div style={{ borderRadius: '0px 0px 5px 5px', padding: '5px' }}>
                            {filteredLeads.length === 0 && (
                              <div className="text-center text-muted mt-2">
                                Nenhum lead encontrado
                              </div>
                            )}
                            {paginatedLeads && paginatedLeads.map((lead) => (
                              <Row key={lead.id} className='list-item align-items-center mb-2'>
                                <Col lg={2} style={{ borderRight: '1px solid var(--blue1)' }}>
                                  {lead.createdAt}
                                </Col>
                                <Col lg={4} style={{ borderRight: '1px solid var(--blue1)' }}>
                                  {lead.firstName}
                                </Col>
                                <Col lg={2} style={{ borderRight: '1px solid var(--blue1)' }}>
                                  {lead.phone}
                                </Col>
                                <Col lg={4}>
                                  {lead.email}
                                </Col>
                                <Col lg={1} className='text-center' style={{ display: 'none'}}>
                                  <div style={{ cursor: 'pointer' }}>
                                    <GoTrash size={20} color="red" />
                                  </div>
                                </Col>
                              </Row>
                            ))}
                            {totalPages > 1 && (
                              <div className="d-flex justify-content-center mt-3">
                                <Pagination>
                                  {/* <Pagination.First
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(1)}
                                  /> */}
                                  <Pagination.Prev
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                  />

                                  {Array.from({ length: totalPages }, (_, index) => {
                                    const page = index + 1
                                    return (
                                      <Pagination.Item
                                        key={page}
                                        active={page === currentPage}
                                        onClick={() => setCurrentPage(page)}
                                      >
                                        {page}
                                      </Pagination.Item>
                                    )
                                  })}

                                  <Pagination.Next
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                  />
                                  {/* <Pagination.Last
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(totalPages)}
                                  /> */}
                                </Pagination>
                              </div>
                            )}
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
