import { useEffect, useState } from 'react'
import { Row, Col, Form, Alert, Table, Spinner, Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import CreatableSelect from 'react-select/creatable'
import { LiaUserLockSolid, LiaSave, LiaTrashAlt, LiaInfoCircleSolid, LiaPlusSolid, LiaEditSolid } from 'react-icons/lia'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'
import type { UserType } from '../types/UserType'

type Option = {
  label: string
  value: string
  isExisting?: boolean
  isDisabled?: boolean
}

export function Users() {
  const websiteId = UseWebsiteStore((s) => s.selectedWebsiteId)
  const selectedWebsiteId = UseWebsiteStore((state) => state.selectedWebsiteId)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
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

  let loggedUserAccessLevelId: number = 3;
  if (
    selectedWebsiteId &&
    user &&
    user.accessLevel &&
    (user.accessLevel as { [key: number]: number })[selectedWebsiteId] !== undefined
  ) {
    loggedUserAccessLevelId = (user.accessLevel as { [key: number]: number })[selectedWebsiteId]
  }

  if (!user) {
    throw new Error('User not found in store')
  }
  
  const isAdmin = loggedUserAccessLevelId === 99 || loggedUserAccessLevelId === 1

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState<number | null>(null)
  const [accessLevelId, setAccessLevelId] = useState(3)
  const [isDefaultWebsite, setIsDefaultWebsite] = useState(false)
  
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [value, setValue] = useState<Option | null>(null)
  const [loading, setLoading] = useState(false)

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  useEffect(() => {
    setSelectedPageId(null)
    
  }, [setSelectedPageId])

  useEffect(() => {
    if (!isValidEmail(inputValue) || websiteId === null) {
      setOptions([])
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)

      const api = new ApiService()
      const userData = await api.getUserByEmail(websiteId, inputValue)

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
          setFirstName(userData.firstName)
          setLastName(userData.lastName)
          setEmail(userData.email)
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

      setLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [inputValue, users, websiteId])

  async function handleSaveUser() {
    if (!websiteId) {
      console.error('Website ID is required')
      return
    }

    console.log('Saving 1')
    setLoading(true)

    const apiService = new ApiService()

    let response
    
    if (newUser) {
      const createData = {
        websiteId,
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
    console.log('Saving 2', response)
    if (response && response.status === 'success') {
      setSuccess(newUser ? 'Usuário criado com sucesso!' : 'Usuário atualizado com sucesso!')
      setNewUser(false)
      setEditUser(false)
      setUserId(null)
      setFirstName('')
      setLastName('')
      setEmail('')
      setAccessLevelId(3)
      setIsDefaultWebsite(false)
      setValue(null)
      await loadUsers()
    } else {
      setError(response && response.message ? response.message : 'Erro ao salvar usuário')
    }
  }

  const confirmDelete = (user: UserType) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const apiService = new ApiService()
      await apiService.deleteUser(userToDelete.id)
      setSuccess('Usuário deletado com sucesso!')
      setShowDeleteModal(false)
      setUserToDelete(null)
      
      // Clear form if deleted user was selected
      if (selectedUser?.id === userToDelete.id) {
        setSelectedUser(null)
        setFirstName('')
        setLastName('')
        setEmail('')
        setAccessLevelId(3)
        setIsDefaultWebsite(false)
      }

      // Reload users
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
    setAccessLevelId(3)
    setIsDefaultWebsite(false)
  }

  function handleEditUser(id: number) {
    setEditUser(true)
    setNewUser(false)
    setUserId(id)
    setFirstName(users.find(u => u.id === id)?.firstName || '')
    setLastName(users.find(u => u.id === id)?.lastName || '')
    setEmail(users.find(u => u.id === id)?.email || '')
    setValue({
      label: users.find(u => u.id === id)?.email || '',
      value: id.toString(),
      isExisting: true
    })
    setAccessLevelId(users.find(u => u.id === id)?.accessLevelId || 3)
    setIsDefaultWebsite(users.find(u => u.id === id)?.defaultWebsiteId === selectedWebsiteId)
    if (id === user?.id) {
      setIsOwnProfile(true)
    } else {
      setIsOwnProfile(false)
    }
  }

  useEffect(() => {
    setSelectedPageId(null)

    if (websiteId !== null && user !== null) {
      const fetchUsers = async () => {
        await loadUsers()
      }
      fetchUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteId, user])

  const loadUsers = async () => {
    if (!websiteId) {
      console.error('No website selected')
      setUsers([])
      return
    }

    setLoadingUsers(true)
    setError(null)
    try {
      const apiService = new ApiService()
      const usersData = await apiService.getUsersByWebsiteId(websiteId)
      let usersArray = Array.isArray(usersData) ? usersData : [usersData]
      usersArray = usersArray.filter(u => u.accessLevelId !== 99 || u.id === user.id)
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
                        <Col lg={12} className='mb-3 text-center' style={{ display: loggedUserAccessLevelId === 99 ? 'block' : 'none' }}>
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
                            disabled={loading}
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
                        <Col lg={12} className='mb-3' style={{ display: loggedUserAccessLevelId === 99 ? 'block' : 'none', position: 'relative' }}>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              placeholder="Buscar usuário pelo nome ou e-mail"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
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
                          {users && users.map((u) => (
                            <div
                              key={u.id}
                              onClick={() => handleEditUser(u.id)}
                              className='mb-3'
                              style={{ 
                                border: u.id === userId ? '2px solid var(--blue3)' : '1px solid var(--blue1)', 
                                borderRadius: '8px', 
                                padding: '12px',
                                cursor: 'pointer',
                                backgroundColor: u?.id === userId ? 'rgba(0, 123, 255, 0.05)' : 'transparent',
                                transition: 'all 0.2s',
                                boxShadow: u?.id === userId ? '0 2px 8px rgba(0, 123, 255, 0.15)' : 'none'
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
                            </div>
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
                            <div className="align-items-center gap-2" style={{ display: loggedUserAccessLevelId === 99 ? 'flex' : 'none' }}>
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
                                  setInputValue(newValue.trim())
                                }
                              }}
                              onChange={(newValue) => {
                                // Não permitir selecionar usuários já vinculados
                                if (newValue && newValue.isDisabled) {
                                  return
                                }
                                setValue(newValue)
                                if (newValue) {
                                  setEmail(newValue.label.includes('(') 
                                    ? newValue.label.match(/\((.+)\)/)?.[1] || newValue.value
                                    : newValue.value
                                  )
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
                            <Form.Select disabled={!isAdmin} onChange={(e) => setAccessLevelId(parseInt(e.target.value))}>
                              <option value="1" selected={editUser ? accessLevelId === 1 : true}>
                                Administrador
                              </option>
                              <option value="2" selected={editUser ? accessLevelId === 2 : true}>
                                Editor
                              </option>
                              <option value="3" selected={editUser ? accessLevelId === 3 : true}>
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
                            <Button variant="primary" onClick={handleSaveUser} style={{ background: 'var(--blue3)', border: 'none', display: isOwnProfile || isAdmin ? 'block' : 'none' }}>
                              <LiaSave size={26} />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-delete-component">Remover usuário</Tooltip>}
                          >
                            <Button variant="primary" type="submit" style={{ display: isAdmin && editUser ? 'block' : 'none', background: 'var(--orange)', border: 'none' }}>
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
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar o usuário <b>{userToDelete?.name}</b>?
          <br />
          Esta ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Deletar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Main>
  )
}
