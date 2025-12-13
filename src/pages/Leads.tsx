import { useEffect, useState, useMemo } from 'react'
import { Row, Col, Form, Pagination, Table, Spinner } from 'react-bootstrap'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import { LiaUserFriendsSolid, LiaSearchSolid, LiaCalendar, LiaSortSolid, LiaSortUpSolid, LiaSortDownSolid, LiaPhoneVolumeSolid, LiaAtSolid, LiaUser } from "react-icons/lia";
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
  const [itemsPerPage] = useState(20)

  const [sortBy, setSortBy] = useState<keyof LeadsType | null>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const [loadingForms, setLoadingForms] = useState(false)
  const [loadingLeads, setLoadingLeads] = useState(false)

  function formatDateBR(date: string) {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(date))
  }
  
  useEffect(() => {
    setSelectedPageId(null)

    if (websiteId !== null) {
      const fetchDashboardInfo = async () => {
        setLoadingForms(true)
        const apiService = new ApiService()
        const formsData = await apiService.getFormsByWebsiteId(websiteId)
        setForms(Array.isArray(formsData) ? formsData : [formsData])
        setLoadingForms(false)

        setLoadingLeads(true)
        const leadsData = await apiService.getLeadsByWebsiteId(websiteId)
        setLeads(Array.isArray(leadsData) ? leadsData : [leadsData])
        setLoadingLeads(false)
      }
      fetchDashboardInfo()
    }
  }, [setSelectedPageId, websiteId])

  const filteredLeads = useMemo(() => {
    const searchNameLower = searchName.toLowerCase()
    const searchEmailLower = searchEmail.toLowerCase()

    return leads.filter((lead) => {
      if (selectedFormId !== 'all' && String(lead.formId) !== selectedFormId) {
        return false
      }

      if (searchNameLower && !lead.firstName?.toLowerCase().includes(searchNameLower)) {
        return false
      }

      if (searchEmailLower && !lead.email?.toLowerCase().includes(searchEmailLower)) {
        return false
      }

      return true
    })
  }, [leads, selectedFormId, searchName, searchEmail])

  const handleSort = (key: keyof LeadsType) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
    setCurrentPage(1)
  }

  const sortedLeads = useMemo(() => {
    if (!sortBy) return [...filteredLeads]

    const sorted = [...filteredLeads].sort((a, b) => {
      const va = a[sortBy]
      const vb = b[sortBy]

      // tratar valores ausentes
      const aIsEmpty = va === undefined || va === null || va === ''
      const bIsEmpty = vb === undefined || vb === null || vb === ''

      if (aIsEmpty && bIsEmpty) return 0
      if (aIsEmpty) return -1
      if (bIsEmpty) return 1

      // Comparador especializado para colunas específicas
      if (sortBy === 'createdAt') {
        const na = new Date(a.createdAt).getTime()
        const nb = new Date(b.createdAt).getTime()

        return sortDir === 'asc' ? na - nb : nb - na
      }

      // se algum campo for number (por exemplo, se LeadsType tiver number)
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va
      }

      // Comparação por string padrão (case-insensitive)
      const cmp = String(va).localeCompare(String(vb), undefined, { sensitivity: 'base', numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })

    return sorted
  }, [filteredLeads, sortBy, sortDir])

  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage)

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedLeads.slice(startIndex, endIndex)
  }, [sortedLeads, currentPage, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedFormId, searchName, searchEmail])

  const renderSortArrow = (key: keyof LeadsType) => {
    if (sortBy !== key) return <LiaSortSolid />
    return sortDir === 'asc' ? <LiaSortUpSolid /> : <LiaSortDownSolid />
  }

  return (
    <Main>
      <Row className="mt-3">
        <Col sm={12} md={12} lg={12}>
          <div className="website-card mb-3">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                  <LiaUserFriendsSolid size={24} />
                  <b>GESTÃO DE LEADS</b>
                </div>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={3} className='pe-md-0 mb-2 mb-lg-0'>
                    <div style={{ position: 'relative', border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      {loadingForms && (
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
                        <Col lg={12} className='mb-3'>
                          <div style={{ background: 'var(--blue3)', borderRadius: '5px', padding: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LiaSearchSolid />
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
                    <div style={{ position: 'relative', border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      {loadingLeads && (
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
                        <Col lg={12}>
                          <Table striped hover bordered responsive>
                            <thead className='table-head'>
                              <tr className='table-head-row'>
                                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer', width: '14%' }}>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-2">
                                      <LiaCalendar />
                                      <b>DATA</b>
                                    </div>
                                    {renderSortArrow('createdAt')}
                                  </div>
                                </th>
                                <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer', width: '36%' }}>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-2">
                                      <LiaUser />
                                      <b>NOME</b>
                                    </div>
                                    {renderSortArrow('firstName')}
                                  </div>
                                </th>
                                <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer', width: '12%' }}>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-2">
                                      <LiaPhoneVolumeSolid />
                                      <b>TELEFONE</b>
                                    </div>
                                    {renderSortArrow('phone')}
                                  </div>
                                </th>
                                <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', width: '36%' }}>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-2">
                                      <LiaAtSolid />
                                      <b>E-MAIL</b>
                                    </div>
                                    {renderSortArrow('email')}
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredLeads.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="text-center text-muted mt-2">
                                    Nenhum lead encontrado
                                  </td>
                                </tr>
                              )}
                              {paginatedLeads && paginatedLeads.map((lead) => (
                                <tr key={lead.id}>
                                  <td style={{ textAlign: 'center' }}>{formatDateBR(lead.createdAt)}</td>
                                  <td>{lead.firstName}</td>
                                  <td style={{ textAlign: 'center' }}>{lead.phone}</td>
                                  <td>{lead.email}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
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
