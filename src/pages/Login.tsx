import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Alert, FloatingLabel, Image, Spinner } from 'react-bootstrap'
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
  const [loading, setLoading] = useState(false)

  const { setAllWebsites, setSelectedWebsiteId, setSelectedWebsite } = UseWebsiteStore((state) => state)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const apiService = new ApiService()
      const response: AuthenticateResponseType = await apiService.authenticate(email, password)

      if (response.status) {
        const user = response.data
        UseUserStore.getState().setUser(user, user.token)

        const websites = await apiService.getAllWebsiteByUserId(user.id, user.token)

        setAllWebsites(websites)
        setLoading(false)

        // adicionar tratamento para caso nao tenha website default definir algum para nao ficar sem nenhum
        const selectedWebsiteFound = websites.find((website) => website.id === user?.defaultWebsiteId)
        if (selectedWebsiteFound) {
          setSelectedWebsite(selectedWebsiteFound)
          setSelectedWebsiteId(selectedWebsiteFound.id)
        }

        navigate('/')
      }
    } catch (err) {
      setLoading(false)
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
    <Container className="website-login-container py-5 px-3" style={{ height: '100vh' }}>
      <Row className="h-100 d-flex justify-content-center align-items-center website-login">
        <Col xs={12} sm={10} md={8} lg={6} className="website-card website-login-card">
          <Form onSubmit={handleSubmit} className="mt-5 mb-5">
            <Row className="text-center">
              <Col lg={12} className="website-login-logo mb-4">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <Image className='mb-2' src="./icon_pixelbuild.png" alt="PixelBuild Logo" width={150} height={150} />
                  <span className="tiktok-sans fw-700" style={{ fontSize: '52px', lineHeight: '40px' }}>PixelBuild</span>
                  <span className="roboto fw-500" style={{ fontSize: '20px' }}>PAINEL ADMINISTRATIVO</span>
                </div>
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
                <Button type="submit" className="w-100 mb-3" style={{ border: 'none', background: 'var(--orange)' }}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      CARREGANDO
                    </>
                  ) : (
                    "ENTRAR"
                  )}
                </Button>
              </Col>
              <Col lg={{ span: 8, offset: 2 }} className="text-center" style={{ display: 'none', cursor: 'pointer' }}>
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
