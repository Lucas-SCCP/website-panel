import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

export function CreatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validatePassword, setValidatePassword] = useState(false)
  const [validatePasswordMessage, setValidatePasswordMessage] = useState('Verificação de senha')
  const [backgroundAlert, setBackgroundAlert] = useState('#EEEEEE')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword) {
      console.log('Senha criada com sucesso:', password, confirmPassword);
    }
  }

  const changePassword = (value: string) => {
    console.log('changePassword', value)
    setPassword(value)
    validatePasswordFunction(value, confirmPassword)
  }

  const changeConfirmPassword = (value: string) => {
    console.log('changeConfirmPassword', value)
    setConfirmPassword(value)
    validatePasswordFunction(password, value)
  }

  const validatePasswordFunction = (password: string, confirmPassword: string) => {
    console.log('validatePasswordFunction', password, confirmPassword)
    setValidatePassword(true)
    setValidatePasswordMessage('Senha válida')
    setBackgroundAlert('#eeffdeff')
    if (password !== confirmPassword) {
      setValidatePassword(false)
      setValidatePasswordMessage('As senhas não coincidem')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (password.length < 8) {
      setValidatePassword(false)
      setValidatePasswordMessage('A senha deve ter pelo menos 8 caracteres')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (!/[A-Z]/.test(password)) {
      setValidatePassword(false)
      setValidatePasswordMessage('A senha deve conter pelo menos uma letra maiúscula')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (!/[a-z]/.test(password)) {
      setValidatePassword(false)
      setValidatePasswordMessage('A senha deve conter pelo menos uma letra minúscula')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (!/[0-9]/.test(password)) {
      setValidatePassword(false)
      setValidatePasswordMessage('A senha deve conter pelo menos um número')
      setBackgroundAlert('#ffddddff')
      return
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setValidatePassword(false)
      setValidatePasswordMessage('A senha deve conter pelo menos um caractere especial')
      setBackgroundAlert('#ffddddff')
      return
    }
  }

  useEffect(() => {
    document.title = 'NOIS Painel Administrativo - Criar Senha';
  }, [])

  return (
    <Container style={{ height: '100vh' }}>
      <Row className="d-flex justify-content-center align-items-center">
        <Col lg={{ span: 6 }} className='mt-5 mb-5' style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
          <Row>
            <Col lg={{ span: 12 }} className='text-center'>
              <span className='modak' style={{ fontSize: '8em', color: '#CCCCCC' }}>NOIS</span>
              <h4 className='krona' style={{ fontSize: '16px', display: 'none' }}>PAINEL ADMINISTRATIVO</h4>
            </Col>
            <Col lg={{ span: 12 }} className='text-center' style={{ padding: '20px' }}>
              <Row>
                <Col lg={12}>
                  <div className='mb-3' style={{ border: '3px solid #DDDDDD', padding: '20px', borderRadius: '10px' }}>
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
                  <div style={{ border: '3px solid #DDDDDD', padding: '20px', borderRadius: '10px' }}>
                    <div style={{ borderRadius: '5px', backgroundColor: '#EEEEEE', fontSize: '24px', padding: '30px' }}>
                      lucas.2601@gmail.com
                    </div>  
                  </div>
                </Col>
                <Col lg={12}>
                  <div className='mb-3' style={{ border: '3px solid #DDDDDD', padding: '20px', borderRadius: '10px' }}>
                    <Row>
                      <Col lg={{ span: 6 }}>
                        <Form.Group className="mb-3">
                          <Form.Label>Senha</Form.Label>
                          <Form.Control type="password" placeholder="Digite sua senha" onChange={(e) => changePassword(e.target.value)} />
                        </Form.Group>
                      </Col>
                      <Col lg={{ span: 6 }} className='ps-0'>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirmação de senha</Form.Label>
                          <Form.Control type="password" placeholder="Confirme sua senha" onChange={(e) => changeConfirmPassword(e.target.value)} />
                        </Form.Group>
                      </Col>
                      <Col lg={{ span: 12 }} style={{ display: 'none' }}>
                        <div className='mb-3' style={{ backgroundColor: backgroundAlert, borderRadius: '5px', padding: '8px' }}>
                          {validatePasswordMessage}
                        </div>
                      </Col>
                      <Col lg={{ span: 6, offset: 3 }}>
                        <Button variant="success" disabled={!validatePassword} type="button" className='w-100' onClick={handleSubmit}>Salvar</Button>
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
