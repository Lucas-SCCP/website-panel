import { useEffect, useState } from 'react'
import { Row, Col, Form, Alert, Table, Spinner, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import CreatableSelect from 'react-select/creatable'
import { LiaUserLockSolid, LiaUsersCogSolid, LiaUserPlusSolid, LiaSave, LiaTrashAlt, LiaInfoCircleSolid } from 'react-icons/lia'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'

type Option = {
  label: string
  value: string
  isExisting?: boolean
  isDisabled?: boolean
}

export function Users() {
  const websiteId = UseWebsiteStore((s) => s.selectedWebsiteId)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const [newUser, setNewUser] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [users, setUsers] = useState<Array<any>>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const { user } = UseUserStore()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [accessLevelId, setAccessLevelId] = useState(3)
  const [isDefaultWebsite, setIsDefaultWebsite] = useState(false)

  const [searchUser, setSearchUser] = useState(false)
  
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [value, setValue] = useState<Option | null>(null)
  const [loading, setLoading] = useState(false)

  function isValidEmail(email: string) {
    // console.log('isValidEmail')
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
      // console.log('Buscando usuário por email:', inputValue)

      const api = new ApiService()
      const userData = await api.getUserByEmail(websiteId, inputValue)

      if (userData) {
        // Verificar se o usuário já está vinculado ao site
        const isAlreadyLinked = users.some(u => u.id === userData.id)
        
        if (isAlreadyLinked) {
          // console.log('Usuário já vinculado ao site')
          setOptions([
            {
              label: `${userData.email} - Já vinculado`,
              value: userData.id.toString(),
              isExisting: true,
              isDisabled: true
            }
          ])
          setSearchUser(false)
        } else {
          // console.log('userData', userData)
          setSearchUser(true)
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
        setSearchUser(false)
        setOptions([])
      }

      setLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [inputValue, users, websiteId])

  function handleSaveUser() {
    const apiService = new ApiService()
    const userData = {
      firstName,
      lastName,
      email,
      accessLevelId,
      isDefaultWebsite
    }
    if (newUser) {
      apiService.createUser(websiteId!, userData)
    } else {
      apiService.updateUser(websiteId!, userData)
    }
  }

  function handleNewUser() {
    setNewUser(true)
    setEditUser(false)
    setValue(null)
    setIsOwnProfile(true)
    setSearchUser(false)
    setFirstName('')
    setLastName('')
    setEmail('')
    setAccessLevelId(3)
    setIsDefaultWebsite(false)
  }

  function handleEditUser(id: number) {
    setSearchUser(false)
    setEditUser(true)
    setNewUser(false)
    setFirstName(users.find(u => u.id === id)?.firstName || '')
    setLastName(users.find(u => u.id === id)?.lastName || '')
    setEmail(users.find(u => u.id === id)?.email || '')
    setValue({
      label: users.find(u => u.id === id)?.email || '',
      value: id.toString(),
      isExisting: true
    })
    setAccessLevelId(users.find(u => u.id === id)?.accessLevelId || 3)
    setIsDefaultWebsite(users.find(u => u.id === id)?.isDefaultWebsite || false)
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
        // console.log('user store', user)
        setLoadingUsers(true)
        const apiService = new ApiService()
        const usersData = await apiService.getUsersByWebsiteId(websiteId)
        setUsers(Array.isArray(usersData) ? usersData : [usersData])
        setLoadingUsers(false)
      }
      fetchUsers()
    }
  }, [setSelectedPageId, websiteId, user])

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
                  <Col lg={3} className='pe-md-0'>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12} className='mb-2 text-center'>
                          <div onClick={handleNewUser} className='users-itens'>
                            <LiaUserPlusSolid />
                            <b>ADICIONAR USUÁRIO</b>
                          </div>
                        </Col>
                        <Col lg={12} className='mb-2 text-center'>
                          <div style={{ background: 'var(--blue3)', borderRadius: '5px', padding: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LiaUsersCogSolid />
                            <b>USUÁRIOS</b>
                          </div>
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
                        {users && users.map((user) => (
                          <Col lg={12} className='mb-2' key={user.id}>
                            <div onClick={() => handleEditUser(user.id)} className='users-itens'>
                              <b>{user.firstName} {user.lastName} ({user.email})</b>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Col>
                  <Col lg={5} className='pe-md-0' style={{ display: newUser || editUser ? 'block' : 'none' }}>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '5px', padding: '10px' }}>
                      <Row>
                        <Col lg={12}>
                          <Row>
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
                                <Form.Select>
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
                                <Form.Select disabled={editUser && !isOwnProfile}>
                                  <option value="1" selected={editUser ? isDefaultWebsite : true}>
                                    Sim
                                  </option>
                                  <option value="2" selected={editUser ? !isDefaultWebsite : true}>
                                    Não
                                  </option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col lg={4} style={{ display: 'flex', gap: '10px' }}>
                              <OverlayTrigger
                                placement="bottom"
                                overlay={
                                <Tooltip id="tooltip-delete-component">
                                  {newUser ? 'Adicionar usuário' : 'Salvar alterações'}
                                </Tooltip>}
                              >
                                <Button variant="primary" onClick={handleSaveUser} style={{ background: 'var(--blue3)', border: 'none' }}>
                                  <LiaSave size={26} />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip id="tooltip-delete-component">Remover usuário</Tooltip>}
                              >
                                <Button variant="primary" type="submit" style={{ display: editUser ? 'block' : 'none', background: 'var(--orange)', border: 'none' }}>
                                  <LiaTrashAlt size={26} />
                                </Button>
                              </OverlayTrigger>
                            </Col>
                          </Row>
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
    </Main>
  )
}
