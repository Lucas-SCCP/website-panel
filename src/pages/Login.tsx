import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert, FloatingLabel } from 'react-bootstrap'
import { ApiService } from '../services/ApiService'
import { UseUserStore } from '../stores/UseUserStore'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { AuthenticateException } from '../exceptions/AuthenticateException'
import type { AuthenticateResponseType } from 'website-lib'

export function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { setAllWebsites, setSelectedWebsiteId, setSelectedWebsite } = UseWebsiteStore((state) => state)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const apiService = new ApiService()
      const response: AuthenticateResponseType = await apiService.authenticate(email, password)

      if (response.status) {
        const user = response.data
        UseUserStore.getState().setUser(user, user.token)

        const websites = await apiService.getAllWebsiteByUserId(user.id, user.token)
        console.log('Websites fetched apos login:', websites)

        setAllWebsites(websites)

        const selectedWebsiteFound = websites.find((website) => website.id === user?.default_website_id)
        if (selectedWebsiteFound) {
          setSelectedWebsite(selectedWebsiteFound)
          setSelectedWebsiteId(selectedWebsiteFound.id)
        }

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
    <Container className="website-login-container" style={{ height: '100vh' }}>
      <Row className="h-100 d-flex justify-content-center align-items-center">
        <Col lg={6} className="website-card website-login-card">
          <Form onSubmit={handleSubmit} className="mb-5">
            <Row className="text-center">
              <Col lg={12} className="website-login-logo">
                <span className="modak">NOIS</span>
              </Col>
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
              <Col lg={{ span: 8, offset: 2 }} className="text-center" style={{ cursor: 'pointer', display: 'none' }} id='aSerDesenvolvido'>
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
        </Col>
      </Row>
    </Container>
  )
}
