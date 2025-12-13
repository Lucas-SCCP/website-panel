import { useEffect, useState } from 'react'
import { Row, Col, Form, Alert, Table, Spinner } from 'react-bootstrap'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import { LiaUserLockSolid, LiaUsersCogSolid, LiaUserPlusSolid } from 'react-icons/lia'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'

export function Users() {
  const websiteId = UseWebsiteStore((s) => s.selectedWebsiteId)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const [newUser, setNewUser] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [users, setUsers] = useState<Array<any>>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const { user } = UseUserStore()
  
  useEffect(() => {
    setSelectedPageId(null)
  }, [setSelectedPageId])

  function handleNewUser() {
    setNewUser(true)
    setEditUser(false)
  }

  function handleEditUser(id: number) {
    setEditUser(true)
    setNewUser(false)
    setSelectedUserId(id)
  }

  useEffect(() => {
    setSelectedPageId(null)

    if (websiteId !== null && user !== null) {
      const fetchUsers = async () => {
        console.log('user store', user.id)
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
                                      Ao digitar o email de um usuário, se ele existir você poderá vincula-lo ao seu site.
                                    </li>
                                    <li>
                                      Se o email não existir, um novo usuário será criado e vinculado ao seu site.
                                    </li>
                                    <li>
                                      Ao criar um novo usuário será enviado um email para criação da senha.
                                    </li>
                                    <li>
                                      O e-mail não pode ser alterado.
                                    </li>
                                    <li>
                                      Os demais dados só poderão ser alterados por ele mesmo.
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
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Email do usuário"
                                  readOnly={editUser}
                                  value={editUser ? users.find(u => u.id === selectedUserId)?.email || '' : ''}
                                />
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Nome do usuário"
                                  readOnly={editUser}
                                  value={editUser ? users.find(u => u.id === selectedUserId)?.firstName || '' : ''}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Sobrenome</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Sobrenome do usuário"
                                  readOnly={editUser}
                                  value={editUser ? users.find(u => u.id === selectedUserId)?.lastName || '' : ''}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Nível de acesso</Form.Label>
                                <Form.Select>
                                  <option value="1" selected={editUser ? users.find(u => u.id === selectedUserId)?.accessLevelId === 1 : true}>Administrador</option>
                                  <option value="2" selected={editUser ? users.find(u => u.id === selectedUserId)?.accessLevelId === 2 : true}>Editor</option>
                                  <option value="3" selected={editUser ? users.find(u => u.id === selectedUserId)?.accessLevelId === 3 : true}>Visualizador</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg={4} style={{ display: editUser ? 'block' : 'none' }}>
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
