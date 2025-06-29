import { Row, Col, Image, Dropdown, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FaHome } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";

export default function Menu() {
  return (
    <Col lg={2} style={{ background: '#EEE', height: '100vh' }}>
      <Row>
        <Col lg={12} className='text-center' style={{ marginTop: '20px' }}>
          <Image
            width='150px'
            src="https://media.istockphoto.com/id/1337144146/pt/vetorial/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=_XeYoSJQIN7GrE08cUQDJCo3U7yvoEp5OKpbhQzpmC0="
            roundedCircle
          />
        </Col>
        <Col lg={12} className='text-center' style={{ padding: '20px' }}>
          <div>Lucas da Silva</div>
          <div style={{ fontSize: '14px', color: '#A1A1A1' }}>minha conta | sair</div>
        </Col>
        <hr />
        <Col lg={12} style={{ marginBottom: '20px' }}>
          <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ width: '100%' }}>
              Selecione um site
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
              <Dropdown.Item href="#">Nois.dev.br</Dropdown.Item>
              <Dropdown.Item href="#">Postos Elefantinho</Dropdown.Item>
              <Dropdown.Item href="#">CT Clean Foods</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <hr />
        <Col lg={12}>
          <Row>
            <Col lg={6}>
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip id={'tooltip-bottom'}>
                    Página inicial
                  </Tooltip>
                }
              >
                <a
                  href='/'
                  style={{
                    border: '3px solid #BBB',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#AAA'
                  }}
                >
                  <FaHome size={30} />
                </a>
              </OverlayTrigger>
            </Col>
            <Col lg={6}>
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip id={'tooltip-bottom'}>
                    Configurações
                  </Tooltip>
                }
              >
                <a
                  href='/settings'
                  style={{
                    border: '3px solid #BBB',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#AAA'
                  }}
                >
                  <MdOutlineSettings size={30} />
                </a>
              </OverlayTrigger>
            </Col>
          </Row>
        </Col>
        <hr style={{ marginTop: '20px', marginBottom: '20px' }}/>
        <Col>
          <Row>
            <Col lg={12} style={{ marginBottom: '10px' }}>
              <Button
                variant='outline-secondary'
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <MdAddCircleOutline />
                Criar nova página
              </Button>
            </Col>
            <Col lg={12}>
              <Dropdown style={{ width: '100%' }}>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
                  Selecione uma página
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: '100%' }}>
                  <Dropdown.Item href="/pages">Página inicial</Dropdown.Item>
                  <Dropdown.Item href="#">Sobre</Dropdown.Item>
                  <Dropdown.Item href="#">Contato</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
}
