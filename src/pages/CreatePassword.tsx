import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Image, Alert, Spinner } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { ApiService } from '../services/ApiService'
import type { ValidateTokenResponseType } from '../types/ValidateTokenType'

export function CreatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [validatePasswordMessage, setValidatePasswordMessage] = useState('Verificação de senha')
  const [backgroundAlert, setBackgroundAlert] = useState('#EEEEEE')
  const [searchParams] = useSearchParams()
  const [tokenData, setTokenData] = useState<ValidateTokenResponseType | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [passwordCreatedSuccess, setPasswordCreatedSuccess] = useState(false)
  const [passwordCreatedError, setPasswordCreatedError] = useState(false)
  const [loading, setLoading] = useState(false)

  const token = searchParams.get('token')
  const apiService = new ApiService()

  useEffect(() => {
    document.title = 'PixelBuild - Criar Senha'

    const checkToken = async () => {
      if (!token) {
        setTokenData({ isValid: false })
        setIsValidating(false)
        return
      }

      try {
        const result = await apiService.validateToken(token)
        setTokenData(result)
      } catch (error) {
        console.error('Erro ao validar token:', error)
        setTokenData({ isValid: false })
      } finally {
        setIsValidating(false)
      }
    }

    checkToken()
  }, [token])

  if (isValidating) {
    return (
      <Container style={{ height: '100vh' }}>
        <Row className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
          <Col lg={{ span: 6 }} className='text-center' style={{ backgroundColor: 'white', borderRadius: '10px', padding: '40px' }}>
            <h3>Validando token...</h3>
            <p>Por favor, aguarde.</p>
          </Col>
        </Row>
      </Container>
    )
  }

  if (!token || !tokenData?.isValid) {
    return (
      <Container style={{ height: '100vh' }}>
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg={{ span: 6 }} className='mt-5 mb-5' style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
            <Row>
              <Col lg={{ span: 12 }} className='text-center' style={{ padding: '20px' }}>
                <h3>Token inválido</h3>
                <p>O token para criação de senha é inválido ou expirou. Por favor, solicite um novo link para criar sua senha.</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    const response = await apiService.createPassword(tokenData?.id, password)
    if (response.status) {
      setPassword('')
      setConfirmPassword('')
      setPasswordCreatedSuccess(true)
    } else {
      setPasswordCreatedError(true)
    }
    setLoading(false)
  }

  const changePassword = (value: string) => {
    // console.log('changePassword', value)
    setPassword(value)
    validatePasswordFunction(value, confirmPassword)
  }

  const changeConfirmPassword = (value: string) => {
    // console.log('changeConfirmPassword', value)
    setConfirmPassword(value)
    validatePasswordFunction(password, value)
  }

  const validatePasswordFunction = (password: string, confirmPassword: string) => {
    // console.log('validatePasswordFunction', password, confirmPassword)
    setIsValidPassword(true)
    setValidatePasswordMessage('Senha válida')
    setBackgroundAlert('#eeffdeff')
    if (password !== confirmPassword) {
      // console.log('As senhas não coincidem')
      setIsValidPassword(false)
      setValidatePasswordMessage('As senhas não coincidem')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (password.length < 8) {
      setIsValidPassword(false)
      setValidatePasswordMessage('A senha deve ter pelo menos 8 caracteres')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (!/[A-Z]/.test(password)) {
      setIsValidPassword(false)
      setValidatePasswordMessage('A senha deve conter pelo menos uma letra maiúscula')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (!/[a-z]/.test(password)) {
      setIsValidPassword(false)
      setValidatePasswordMessage('A senha deve conter pelo menos uma letra minúscula')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (!/[0-9]/.test(password)) {
      setIsValidPassword(false)
      setValidatePasswordMessage('A senha deve conter pelo menos um número')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setIsValidPassword(false)
      setValidatePasswordMessage('A senha deve conter pelo menos um caractere especial')
      setBackgroundAlert('#ffddddff')
      return
    }
  }

  return (
    <Container style={{ height: '100vh' }}>
      <Row className="d-flex justify-content-center align-items-center">
        <Col lg={{ span: 6 }} className='mt-5 mb-5' style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
          <Row>
            <Col lg={{ span: 12 }} className='text-center'>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <Image className='mb-2' src="./icon_pixelbuild.png" alt="PixelBuild Logo" width={150} height={150} />
                <span className="tiktok-sans fw-700" style={{ fontSize: '52px', lineHeight: '40px' }}>PixelBuild</span>
                <span className="roboto fw-500" style={{ fontSize: '20px' }}>PAINEL ADMINISTRATIVO</span>
              </div>
            </Col>
            <Col lg={{ span: 12 }} className='text-center' style={{ padding: '20px' }}>
              <Row>
                <Col lg={12}>
                  <div className='mb-3' style={{ border: '3px solid var(--blue1)', padding: '20px', borderRadius: '10px' }}>
                    <p>
                      Escolha uma senha para acessar o Painel Administrativo. <br />
                      Crie uma senha única e forte para garantir a segurança do seu site. <br /><br />
                      Utilize: <br />
                      - No mínimo 8 caracteres <br />
                      - Letras maiúsculas e minúsculas <br />
                      - Números <br />
                      - No mínimo um caractere especial <br />
                    </p>
                  </div>
                </Col>
                <Col lg={12} className='mb-3' style={{ fontSize: '20px' }}>
                  <div style={{ border: '3px solid var(--blue1)', padding: '20px', borderRadius: '10px' }}>
                    <div style={{ borderRadius: '5px', backgroundColor: '#EEE', fontSize: '24px', padding: '30px' }}>
                      {tokenData?.isValid ? tokenData.email : 'lucas.2601@gmail.com'}
                    </div>  
                  </div>
                </Col>
                <Col lg={12}>
                  <div className='mb-3' style={{ border: '3px solid var(--blue1)', padding: '20px', borderRadius: '10px' }}>
                    <Row>
                      <Col lg={{ span: 6 }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Senha</Form.Label>
                          <Form.Control value={password} type="password" placeholder="Digite sua senha" onChange={(e) => changePassword(e.target.value)} />
                        </Form.Group>
                      </Col>
                      <Col lg={{ span: 6 }} className='ps-0'>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirmação de senha</Form.Label>
                          <Form.Control value={confirmPassword} type="password" placeholder="Confirme sua senha" onChange={(e) => changeConfirmPassword(e.target.value)} />
                        </Form.Group>
                      </Col>
                      <Col lg={{ span: 12 }} style={{ display: isValidPassword || (!password || !confirmPassword) ? 'none' : 'block' }}>
                        <div className='mb-3' style={{ backgroundColor: backgroundAlert, borderRadius: '5px', padding: '8px' }}>
                          {validatePasswordMessage}
                        </div>
                      </Col>
                      <Col lg={{ span: 6, offset: 3 }}>
                        <Button disabled={!isValidPassword} type="button" className='w-100 default-button' onClick={handleSubmit}>
                          {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />{" "}
                            Salvando...
                          </>
                        ) : (
                          "Salvar"
                        )}
                        </Button>
                      </Col>
                      <Col lg={{ span: 12 }}>
                        <Alert variant="success" className='mt-3' style={{ display: passwordCreatedSuccess ? 'block' : 'none' }}>
                          Parabéns! Senha criada com sucesso.
                        </Alert>
                        <Alert variant="danger" className='mt-3' style={{ display: passwordCreatedError ? 'block' : 'none' }}>
                          Ops! Ocorreu um erro ao criar sua senha. Tente novamente.
                        </Alert>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
