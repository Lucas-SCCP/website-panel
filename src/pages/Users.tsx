import { useEffect, useState } from 'react'
import { Row, Col, Form, Alert, Table, Spinner, Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import CreatableSelect from 'react-select/creatable'
import { LiaUserLockSolid, LiaSave, LiaTrashAlt, LiaInfoCircleSolid, LiaPlusSolid, LiaEditSolid } from 'react-icons/lia'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'
import { PlanService } from '../services/PlanService'
import type { UserType } from '../types/UserType'
import { AccessLevelEnum } from '../enums/AcessLevelEnum'

type Option = {
  label: string
  value: string
  isExisting?: boolean
  isDisabled?: boolean
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function Users() {
  const selectedWebsiteId = UseWebsiteStore((state) => state.selectedWebsiteId)
  const allWebsites = UseWebsiteStore((state) => state.allWebsites)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  
  const [website] = useState(allWebsites.find(w => w.id === selectedWebsiteId) || null)

  const [newUser, setNewUser] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [users, setUsers] = useState<UserType[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const { user } = UseUserStore()

  if (!user) {
    throw new Error('User not found in store')
  }

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState<number | null>(null)
  const [accessLevelId, setAccessLevelId] = useState(3)
  const [isDefaultWebsite, setIsDefaultWebsite] = useState(false)
  
  const [searchInputValue, setSearchInputValue] = useState('') // Para Form.Control
  const [emailInputValue, setEmailInputValue] = useState('') // Para CreatableSelect
  const [options, setOptions] = useState<Option[]>([])
  const [value, setValue] = useState<Option | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [limitUsers, setLimitUsers] = useState<number>(0)
  const [limitUserExceeded, setLimitUserExceeded] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    setSelectedPageId(null)
    
  }, [setSelectedPageId])

  useEffect(() => {
    if (!isValidEmail(emailInputValue) || selectedWebsiteId === null) {
      setOptions([])
      return
    }

    const timeout = setTimeout(async () => {
      const api = new ApiService()
      const userData = await api.getUserByEmail(selectedWebsiteId, emailInputValue)

      if (userData) {
        const isAlreadyLinked = users.some(u => u.id === userData.id)
        if (isAlreadyLinked) {
          setOptions([
            {
              label: `${userData.email} - Já vinculado`,
              value: userData.id.toString(),
              isExisting: true,
              isDisabled: true
            }
          ])
        } else {
          setOptions([
            {
              label: userData.email,
              value: userData.id.toString(),
              isExisting: true,
              isDisabled: false
            }
          ])
        }
      } else {
        setOptions([])
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [emailInputValue, users, selectedWebsiteId])

  async function handleSaveUser() {
    if (!selectedWebsiteId) {
      console.error('Website ID is required')
      return
    }

    setLoading(true)

    const apiService = new ApiService()

    let response
    
    if (newUser) {
      const createData = {
        websiteId: selectedWebsiteId,
        firstName,
        lastName,
        email,
        accessLevelId,
        websiteDefault: isDefaultWebsite ? selectedWebsiteId : null
      }
      response = await apiService.createUser(createData)
    } else {
      if (!userId) {
        console.error('User ID is required for update')
        return
      }
      const updateData = {
        id: userId,
        firstName,
        lastName,
        email,
        accessLevelId,
        websiteDefault: isDefaultWebsite ? selectedWebsiteId : null
      }
      response = await apiService.updateUser(updateData)
    }
    setLoading(false)
    if (response?.status === 'success') {
      setSuccess(newUser ? 'Usuário criado com sucesso!' : 'Usuário atualizado com sucesso!')
      setNewUser(false)
      setEditUser(false)
      setUserId(null)
      setFirstName('')
      setLastName('')
      setEmail('')
      setAccessLevelId(AccessLevelEnum.Administrador)
      setIsDefaultWebsite(false)
      setValue(null)
      await loadUsers()
    } else {
      setError(response?.message ? response.message : 'Erro ao salvar usuário')
    }
  }

  function confirmDelete(user: UserType) {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  async function handleDeleteUser() {
    if (!userToDelete || selectedWebsiteId === null) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const apiService = new ApiService()
      await apiService.deleteUserFromWebsite(userToDelete.id, selectedWebsiteId)
      setSuccess('Usuário removido com sucesso!')
      setShowDeleteModal(false)
      setUserToDelete(null)

      setNewUser(false)
      setEditUser(false)
      setSelectedUser(null)
      setFirstName('')
      setLastName('')
      setEmail('')
      setAccessLevelId(AccessLevelEnum.Administrador)
      setIsDefaultWebsite(false)

      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar usuário')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleNewUser() {
    setNewUser(true)
    setEditUser(false)
    setValue(null)
    setIsOwnProfile(true)
    setUserId(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setAccessLevelId(AccessLevelEnum.Administrador)
    setIsDefaultWebsite(false)
  }

  function handleEditUser(id: number) {
    setEditUser(true)
    setNewUser(false)
    setUserId(id)
    setSelectedUser(users.find(u => u.id === id) || null)
    setFirstName(users.find(u => u.id === id)?.firstName || '')
    setLastName(users.find(u => u.id === id)?.lastName || '')
    setEmail(users.find(u => u.id === id)?.email || '')
    setValue({
      label: users.find(u => u.id === id)?.email || '',
      value: id.toString(),
      isExisting: true
    })
    setAccessLevelId(users.find(u => u.id === id)?.accessLevelId || AccessLevelEnum.Administrador)
    setIsDefaultWebsite(users.find(u => u.id === id)?.defaultWebsiteId === selectedWebsiteId)
    if (id === user?.id) {
      setIsOwnProfile(true)
    } else {
      setIsOwnProfile(false)
    }
  }

  useEffect(() => {
    setSelectedPageId(null)

    if (selectedWebsiteId !== null && user !== null) {
      const fetchUsers = async () => {
        await loadUsers()
      }
      fetchUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWebsiteId, user])

  async function loadUsers() {
    if (!selectedWebsiteId) {
      console.error('No website selected')
      setUsers([])
      return
    }

    if (!user) {
      console.error('User not found in store')
      setUsers([])
      return
    }

    setLoadingUsers(true)
    setError(null)
    try {
      const apiService = new ApiService()
      const usersData = await apiService.getUsersByWebsiteId(selectedWebsiteId)
      let usersArray = Array.isArray(usersData) ? usersData : [usersData]
      usersArray = usersArray.filter(u => u.accessLevelId !== AccessLevelEnum.SuperUsuario || u.id === user.id)
      
      const planService = new PlanService()
      const limit = planService.getLimitUsersByPlan(website?.planId || 0)
      const total = usersArray.filter(u => u.accessLevelId !== AccessLevelEnum.SuperUsuario).length
      setLimitUsers(limit)
      setTotalUsers(total)
      setLimitUserExceeded(total >= limit)
      setUsers(usersArray)
      return usersArray
    } catch (err) {      
      
      console.error('Erro ao carregar usuários:', err)
      setError('Erro ao carregar usuários')
      setUsers([])
      return []
    } finally {
      setLoadingUsers(false)
    }
  }

  if (loading) {
    return (
      <Main>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </Main>
    )
  }

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
                  <Col lg={4} className='pe-md-0 mb-md-0 mb-2'>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12} className='mb-3 text-center'>
                          <Button 
                            onClick={handleNewUser}
                            style={{ 
                              background: 'var(--blue3)', 
                              border: 'none',
                              borderRadius: '8px', 
                              padding: '10px',
                              width: '100%',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              transition: 'all 0.2s'
                            }}
                            className='tiktok-sans fw-100'
                            disabled={loading || limitUserExceeded}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            <LiaPlusSolid className="me-2" />
                            CRIAR NOVO USUÁRIO
                          </Button>
                        </Col>
                        <Col lg={12} className='mb-2' style={{ display: 'none', position: 'relative' }}>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              placeholder="Buscar usuário pelo nome ou e-mail"
                              value={searchInputValue}
                              onChange={(e) => setSearchInputValue(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        {loadingUsers && (
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
                        <Col lg={12}>
                          <div className='mb-2'>
                            {totalUsers} de {limitUsers} usuários
                          </div>
                          {users?.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              aria-pressed={u.id === userId}
                              onClick={() => handleEditUser(u.id)}
                              className='mb-3'
                              style={{ 
                                border: u.id === userId ? '2px solid var(--blue3)' : '1px solid var(--blue1)', 
                                borderRadius: '8px', 
                                padding: '12px',
                                cursor: 'pointer',
                                backgroundColor: u?.id === userId ? 'rgba(0, 123, 255, 0.05)' : 'transparent',
                                transition: 'all 0.2s',
                                boxShadow: u?.id === userId ? '0 2px 8px rgba(0, 123, 255, 0.15)' : 'none',
                                width: '100%',
                                textAlign: 'left'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                  src={'./user_avatar.png'}
                                  alt={u.firstName}
                                  style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    flexShrink: 0
                                  }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div style={{ fontWeight: 'bold' }}>
                                    {u.firstName} {u.lastName}
                                  </div>
                                  <div style={{ fontSize: '0.95em', color: '#444' }}>
                                    {u.email}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg={8} style={{ display: newUser || editUser ? 'block' : 'none' }}>
                    {error && (
                      <Alert variant="danger" onClose={() => setError(null)} dismissible>
                        {error}
                      </Alert>
                    )}
                    {success && (
                      <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                        {success}
                      </Alert>
                    )}
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2" style={{
                            paddingBottom: '12px',
                          }}>
                            <h5 className="mb-0 d-flex align-items-center">
                              {newUser ? (
                                <>
                                  <LiaPlusSolid className="me-2" style={{ fontSize: '1rem' }} />
                                  Criar Usuário
                                </>
                              ) : (
                                <>
                                  <LiaEditSolid size={24} className="me-2" style={{ marginTop: '-2px' }} />
                                  Editar Usuário
                                </>
                              )}
                            </h5>
                            <div className="align-items-center gap-2" style={{ display: UseUserStore.getState().userAccessLevelId === AccessLevelEnum.SuperUsuario ? 'flex' : 'none' }}>
                              <Button 
                                variant="success" 
                                onClick={handleSaveUser}
                                disabled={loading}
                                className="d-flex align-items-center"
                              >
                                <LiaSave className="me-1" size={18} />
                                Salvar
                              </Button>
                              {!newUser && (
                                <Button 
                                  variant="danger" 
                                  onClick={() => selectedUser && confirmDelete(selectedUser)}
                                  disabled={loadingUsers}
                                >
                                  <LiaTrashAlt size={18} />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col lg={12} style={{ display: newUser ? 'block' : 'none' }}>
                          <Alert variant='info'>
                            <div className='text-center'>
                              <b>Atenção</b>
                            </div>
                            <div>
                              <ul>
                                <li>
                                  Ao digitar o e-mail de um usuário, se ele existir em nossa base de dados você poderá vinculá-lo ao seu site.
                                </li>
                                <li>
                                  Se o e-mail não existir em nossa base de dados, um novo usuário será criado e vinculado ao seu site.
                                </li>
                                <li>
                                  Ao criar um novo usuário será enviado um e-mail para criação da senha.
                                </li>
                                <li>
                                  O e-mail não pode ser alterado.
                                </li>
                                <li>
                                  Os demais dados só poderão ser alterados pelo proprietário.
                                </li>
                                <li>
                                  O nível de acesso pode ser alterado por Administradores.
                                </li>
                              </ul>
                            </div>
                          </Alert>
                        </Col>
                        <Col lg={12}>
                            <Form.Group className="mb-3">
                            <Form.Label className='d-flex align-items-center gap-1'>
                              Email
                              {editUser && <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="tooltip-email">
                                    O e-mail não pode ser alterado.
                                  </Tooltip>
                                }
                              >
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <LiaInfoCircleSolid size={16} />
                                </span>
                              </OverlayTrigger>}
                            </Form.Label>
                            <CreatableSelect<Option, false>
                              placeholder="Digite o e-mail para buscar ou criar um usuário"
                              value={value}
                              options={options}
                              isDisabled={editUser}
                              isLoading={loading}
                              loadingMessage={() => 'Buscando usuário...'}
                              noOptionsMessage={({ inputValue }) => {
                                if (!inputValue) return 'Digite um e-mail para buscar'
                                if (!isValidEmail(inputValue)) return 'Digite um e-mail válido'
                                return 'Nenhum usuário encontrado'
                              }}
                              formatCreateLabel={(inputValue) => `Criar novo usuário: ${inputValue}`}
                              onInputChange={(newValue, meta) => {
                                if (meta.action === 'input-change') {
                                  setEmailInputValue(newValue.trim())
                                }
                              }}
                              onChange={(newValue) => {
                                // Não permitir selecionar usuários já vinculados
                                if (newValue?.isDisabled) {
                                  return
                                }
                                setValue(newValue)
                                if (newValue) {
                                  setEmail(newValue.label.includes('(') 
                                    ? newValue.label.match(/\((.+)\)/)?.[1] || newValue.value
                                    : newValue.value
                                  )
                                  // Atualizar outros campos apenas ao selecionar
                                  if (newValue.isExisting) {
                                    const foundUser = users.find(u => u.id.toString() === newValue.value)
                                    if (foundUser) {
                                      setFirstName(foundUser.firstName)
                                      setLastName(foundUser.lastName)
                                    }
                                  }
                                }
                              }}
                              isOptionDisabled={(option) => option.isDisabled === true}
                              isValidNewOption={(inputValue) => {
                                return (
                                  isValidEmail(inputValue) &&
                                  options.length === 0 &&
                                  !loading
                                )
                              }}
                              isClearable
                            />
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Nome do usuário"
                              readOnly={!isOwnProfile}
                              disabled={!isOwnProfile}
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Sobrenome</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Sobrenome do usuário"
                              readOnly={!isOwnProfile}
                              disabled={!isOwnProfile}
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nível de acesso</Form.Label>
                            <Form.Select disabled={!UseUserStore.getState().isAdmin} onChange={(e) => setAccessLevelId(parseInt(e.target.value))}>
                              <option value="1" selected={editUser ? UseUserStore.getState().userAccessLevelId === AccessLevelEnum.Administrador : true}>
                                Administrador
                              </option>
                              <option value="2" selected={editUser ? UseUserStore.getState().userAccessLevelId === AccessLevelEnum.Editor : true}>
                                Editor
                              </option>
                              <option value="3" selected={editUser ? UseUserStore.getState().userAccessLevelId === AccessLevelEnum.Visualizador : true}>
                                Visualizador
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className='d-flex align-items-center gap-1'>
                              Site padrão
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="tooltip-email">
                                    O site padrão é o site que será carregado ao fazer login no painel.
                                  </Tooltip>
                                }
                              >
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <LiaInfoCircleSolid size={16} />
                                </span>
                              </OverlayTrigger>
                            </Form.Label>
                            <Form.Select disabled={editUser && !isOwnProfile} onChange={() => setIsDefaultWebsite(!isDefaultWebsite)}>
                              <option selected={editUser ? isDefaultWebsite : true}>
                                Sim
                              </option>
                              <option selected={editUser ? !isDefaultWebsite : true}>
                                Não
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col lg={4} style={{ display: 'none', gap: '10px' }}>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                            <Tooltip id="tooltip-delete-component">
                              {newUser ? 'Adicionar usuário' : 'Salvar alterações'}
                            </Tooltip>}
                          >
                            <Button variant="primary" onClick={handleSaveUser} style={{ background: 'var(--blue3)', border: 'none', display: isOwnProfile || UseUserStore.getState().isAdmin ? 'block' : 'none' }}>
                              <LiaSave size={26} />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-delete-component">Remover usuário</Tooltip>}
                          >
                            <Button variant="primary" type="submit" style={{ display: UseUserStore.getState().isAdmin && editUser ? 'block' : 'none', background: 'var(--orange)', border: 'none' }}>
                              <LiaTrashAlt size={26} />
                            </Button>
                          </OverlayTrigger>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg={4} style={{ display: 'none' }}>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12}>
                          Histórico
                        </Col>
                        <Col lg={12} style={{ fontSize: '14px', color: 'gray' }}>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th style={{ width: '30%' }}>Data</th>
                              <th style={{ width: '70%' }}>Ação</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>05/12/2025 14:22</td>
                              <td>Login realizado</td>
                            </tr>
                            <tr>
                              <td>01/12/2025 09:15</td>
                              <td>Senha redefinida</td>
                            </tr>
                            <tr>
                              <td>30/11/2025 11:52</td>
                              <td>Usuário criado</td>
                            </tr>
                          </tbody>
                        </Table>
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remover Acesso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja remover acesso do usuário?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Não
          </Button>
          <Button variant="danger" onClick={handleDeleteUser} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Sim'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Main>
  )
}
