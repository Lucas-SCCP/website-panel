import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert, FloatingLabel } from 'react-bootstrap'
import { ApiService } from '../services/ApiService'
import { UseUserStore } from '../stores/UseUserStore'
import { AuthenticateException } from '../exceptions/AuthenticateException'
import type { AuthenticateResponseType } from 'website-lib'

export function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const apiService = new ApiService()
      const response: AuthenticateResponseType = await apiService.authenticate(email, password)

      if (response.status) {
        UseUserStore.getState().setUser(response.data, response.data.token)
        navigate('/')
      }
    } catch (err) {
      if (err instanceof AuthenticateException) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.')
      }
    }
  }

  const handleForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('esqueci senha')
  }

  return (
    <Container className="d-flex align-items-center justify-content-center website-login-container">
      <Row className="justify-content-center">
        <Col lg={12}>
          <div className="website-card website-login-card">
            <Form onSubmit={handleSubmit} className="mb-5">
              <Row className="text-center">
                <Col lg={12} className="website-login-logo">
                  <span className="modak">NOIS</span>
                </Col>
              </Row>
              <Row>
                <Col lg={{ span: 8, offset: 2 }}>
                  <FloatingLabel controlId="emailInput" label="Digite seu email" className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="passwordInput" label="Digite sua senha" className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col lg={{ span: 8, offset: 2 }} className="text-center">
                  <Button variant="secondary" type="submit" className="w-100 mb-3">
                    ENTRAR
                  </Button>
                </Col>
                <Col lg={12} className="text-center" style={{ cursor: 'pointer' }}>
                  <span onClick={handleForgetPassword}>Recuperar minha senha</span>
                </Col>
                <Col lg={{ span: 8, offset: 2 }} className="mt-3">
                  {error && (
                    <Alert variant="danger" className="text-center">
                      {error}
                    </Alert>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
