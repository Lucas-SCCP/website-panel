import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Form, InputGroup, Image, Button, ProgressBar, OverlayTrigger, Tooltip, Alert, Dropdown } from 'react-bootstrap'
import Switch from 'react-switch'
import { Main } from './Main'
import { ApiService } from '../services/ApiService'
import { Header, Footer } from 'website-lib'
import { GrConfigure } from 'react-icons/gr'
import { BsFillMenuButtonWideFill } from "react-icons/bs"
import { TbPlugConnectedX, TbBoxAlignTopFilled, TbBoxAlignBottomFilled } from "react-icons/tb"
import { IoFileTrayStacked } from "react-icons/io5"
import { MdOutlineHistory } from "react-icons/md"
import { RiBankLine } from "react-icons/ri"
import { FaFilePdf, FaFileImage, FaUsersGear } from "react-icons/fa6"
import { FaEnvelopeOpenText, FaInfoCircle } from 'react-icons/fa'
import { MdAddCircle } from 'react-icons/md';
import { ImExit } from "react-icons/im";
import { TbPencil } from "react-icons/tb";
import { TbPencilPlus } from "react-icons/tb";
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import type { WebsiteType } from 'website-lib'
import type { NotificationType } from '../types/NotificationType'

export function Settings() {
  const navigate = useNavigate()
  const [website, setWebsite] = useState<WebsiteType | null>(null)
  const [selectedMenu, setSelectedMenu] = useState(1)
  const [selectedUser, setSelectedUser] = useState(0)
  const [newUser, setNewUser] = useState(false)
  const [selectedFileType, setSelectedFileType] = useState(0)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isDefaultSite, setIsDefaultSite] = useState(false)
  const [accessLevel, setAccessLevel] = useState('')
  // const [photo, setPhoto] = useState<File | null>(null)
  // const [isActive, setIsActive] = useState(false)

  const [notifications, setNotifications] = useState<NotificationType[]>([])

  const allWebsites = UseWebsiteStore((state) => state.allWebsites)
  const selectedWebsiteId = UseWebsiteStore((state) => state.selectedWebsiteId)
  const selectedPageId = UseWebsiteStore((state) => state.selectedPageId)
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const { updateSelectedWebsiteField } = UseWebsiteStore()
  const setSelectedWebsiteId = UseWebsiteStore((state) => state.setSelectedWebsiteId)
  const setSelectedWebsite = UseWebsiteStore((state) => state.setSelectedWebsite)

  const posts = [
    {
      title: 'METAL BAURU NAS RUAS POR MAIS DIREITOS PARA TRABALHADORES',
      slug: 'metal-bauru-nas-ruas-por-mais-direitos-para-trabalhadores',
      content: 'A delegação de dirigentes do Sindicato dos Metalúrgicos de Bauru (Metal Bauru) teve importante participação na luta dos trabalhadores ' +
        'por mais direitos na 9ª Plenária Estatutária da Federação dos Metalúrgicos (FEM-CUT/SP), promovida nos dias 14, 15 e 16 de maio de 2025, em Itanhaém (SP).' +
        '<br><br> O presidente do Metal Bauru Valdemir Caminaga e os diretores de base Marco Antônio e Willians participaram de uma grande caminhada na última quinta-feira, 16, ' +
        'pelas ruas de Itanhaém, fechando a Plenária.<br><br> Em sua fala, Caminaga destacou a importância da luta pelo fim da escala 6 X 1, da redução dos juros, ' +
        'da isenção de Imposto de Renda para quem ganha até R$ 5 mil mensais e da redução de jornada sem redução salarial, para 40 horas semanais. ' + 
        'Esses são pontos de luta ratificados na 9º Plenária.<br><br> Além dos dirigentes de Sindicatos Metalúrgicos de todo o Estado de São Paulo, contribuíram ' +
        'com a Plenária o ministro do Trabalho e Emprego Luiz Marinho, o ex-ministro da Casa Civil José Dirceu, o deputado federal Vicentinho e o deputado estadual ' +
        'Teonilio Barba, ambos do PT.<br><br>Fotos: Adônis Guerra',
      date: '99/99/9999',
      image_post: 'imageNoticias1001',
      images: [
        {
          content: 'imageNoticias1001',
          title: ''
        },
        {
          content: 'imageNoticias1002',
          title: ''
        },
        {
          content: 'imageNoticias1003',
          title: ''
        },
      ]
    },
    {
      title: 'METAL BAURU MAIS PERTO DA REALIDADE DOS TRABALHADORES',
      slug: 'metal-bauru-mais-perto-da-realidade-dos-trabalhadores',
      content: 'A 9ª Plenária Estatutária da Federação dos Metalúrgicos (FEM-CUT/SP) aprofundou temas importantes que impactam o trabalhador metalúrgico ' +
      'em seu dia a dia. A Plenária ocorreu nos dias 14, 15 e 16 de maio de 2025, reunindo em Itanhaém (SP) diversas lideranças de sindicatos dos metalúrgicos ' +
      'de todo o Estado de São Paulo. <br><br> O Metal Bauru foi representado pelo presidente Valdemir Caminaga e os diretores de base Willians e Marco Antonio. ' +
      'Caminaga destaca as discussões sobre o combate a disseminação de fake news na comunicação com os trabalhadores.<br><br>Ele ressalta que a Plenária fortaleceu o ' +
      'sindicato pelo alto nível das discussões para ação efetiva na base. Caminaga cita como desafios da entidade levantar as bandeiras LGBTQIAPN+, contra o racismo, ' +
      'e fortalecer a luta de combate à violência contra mulheres. <br><br> A 9º Plenária da FEM-CUT/SP aprofundou as discussões de interesse da categoria e também reafirmou ' +
      'a necessidade de avanço nos direitos dos trabalhadores. Entre as pautas destacam-se a luta pelo fim da escala 6 X 1, a redução de jornada sem redução salarial, ' +
      ' para 40 horas semanais, a isenção de Imposto de Renda para quem ganha até R$ 5 mil mensais e a redução dos juros.<br><br>Fotos: Dino Santos',
      date: '99/99/9999',
      image_post: 'imageNoticias2006',
      images: [
        {
          content: 'imageNoticias2001',
          title: ''
        },
        {
          content: 'imageNoticias2002',
          title: ''
        },
        {
          content: 'imageNoticias2003',
          title: ''
        },
        {
          content: 'imageNoticias2004',
          title: ''
        },
        {
          content: 'imageNoticias2005',
          title: ''
        },
        {
          content: 'imageNoticias2006',
          title: ''
        }
      ]
    },
    {
      title: 'METAL BAURU É DESTAQUE NA PRIMEIRA JORNADA DE LUTAS',
      slug: 'metal-bauru-e-destaque-na-primeira-jornada-de-lutas',
      content: 'A participação da diretoria do Sindicato dos Metalúrgicos de Bauru (Metal Bauru) foi destaque na 1ª Jornada de Lutas Mês do Trabalhador, ' + 
      'promovida na manhã deste sábado, 31, no Parque Vitória Régia. Em sua fala, o presidente do Metal Bauru Valdemir Caminaga ressaltou a importância do mês ' + 
      'de maio para o trabalhador, num momento em que as reivindicações exigem mobilização para avançar nas conquistas.<br><br> A Jornada intensificou a reflexão sobre ' + 
      'questões como a luta pelo fim da escala 6 X 1, a redução de jornada, sem redução salarial, para 40 horas semanais. Outro ponto destacado por Caminaga é a ' + 
      'necessidade de avanços nas negociações da nova Convenção Coletiva de Trabalho (CCT) da categoria, com ampliação de direitos. “Direitos se conquistam com luta”, ' +
      'finalizou Caminaga.<br><br>A 1ª Jornada de Lutas Mês do Trabalhador foi promovida pela Subsede Bauru da CUT/SP, com apoio de diversos sindicatos e coletivos políticos ' + 
      'e culturais, com caráter multicultural.<br><br>Fotos: Ricardo Santana',
      date: '99/99/9999',
      image_post: 'imageNoticias3001',
      images: [
        {
          content: 'imageNoticias3001',
          title: ''
        },
        {
          content: 'imageNoticias3002',
          title: ''
        },
        {
          content: 'imageNoticias3003',
          title: ''
        },
        {
          content: 'imageNoticias3004',
          title: ''
        },
        {
          content: 'imageNoticias3005',
          title: ''
        },
      ]
    },
    {
      title: 'METAL AO LADO DOS TRABALHADORES DA EBARA DEFINE ACORDO DA PLR',
      slug: 'metal-ao-lado-dos-trabalhadores-da-ebara-define-acordo-da-plr',
      content: 'A direção do Sindicato dos Metalúrgicos de Bauru (Metal Bauru) promoveu nesta quarta-feira, 20, uma assembleia com os trabalhadores e trabalhadoras ' + 
      'da Ebara em Bauru. Prestigiaram a ação sindical do Metal Bauru os dirigentes da Federação dos Metalúrgicos (FEM-CUT/SP) Jorge Lima (do ABC) ' + 
      'e Carlão (de Taubaté).<br><br>A direção do Metal Bauru, conduziu a discussão e aprovação pelos trabalhadores da proposta de acordo da PLR. O presidente do Metal ' +
      ' Bauru Valdemir Caminaga junto com os dirigentes Varlei, Willians, Cesar e Marco Antônio, coordenou a assembleia que teve ampla participação e aprovação do ' + 
      'acordo pelos trabalhadores da empresa.<br><br> A assembleia contou com apoio do Jurídico do Sindicato, representado pelo advogado Jorge Moura.<br><br>Fotos: Metal Bauru',
      date: '99/99/9999',
      image_post: 'imageNoticias4001',
      images: [
        {
          content: 'imageNoticias4001',
          title: ''
        },
        {
          content: 'imageNoticias4002',
          title: ''
        },
        {
          content: 'imageNoticias4003',
          title: ''
        },
        {
          content: 'imageNoticias4004',
          title: ''
        },
        {
          content: 'imageNoticias4005',
          title: ''
        },
        {
          content: 'imageNoticias4006',
          title: ''
        },
      ]
    },
    {
      title: 'CAMPANHA SALARIAL 2025 - ENTREGA DA PAUTA DEFINE RUMO DAS REIVINDICAÇÕES DOS TRABALADORES POR AVANÇOS',
      slug: 'campanha-salarial-2025-entrega-da-pauta-define-rumo-das-reinvincicacoes-dos-trabalhadores-por-avancos',
      content: 'Grupo de diretores do Sindicato dos Metalúrgicos de Bauru (Metal Bauru) fez a entrega em São Paulo da pauta com reivindicações da ' +
      'Campanha Salarial 2025 dos Metalúrgicos. O tom do documento entregue aos representantes dos patrões é de melhorias nas condições sociais para os ' + 
      'trabalhadores metalúrgicos, discutidas com a base nos últimos meses.<br><br>O objetivo, conforme explica o presidente do Metal Bauru Valdemir Caminaga, ' + 
      'é a ampliação de conquista para categoria, como reajuste e aumento real de salários e cláusulas sociais, que tratam da melhoria da condição de vida ' + 
      'do metalúrgico. E mais os pontos das cláusulas específicas de mesa de negociação com cada empresa.<br><br>A Campanha Salarial 2025 também fortalece o conjunto ' + 
      'de reivindicações dos trabalhadores pela redução de jornada sem redução salarial, para 40 horas semanais, fim da jornada 6 X 1, isenção da cobrança de ' + 
      'imposto de renda para quem recebe até 5 mil reais mensais e redução da taxa de juros.<br><br>Caminaga explica que a pauta ainda atende reivindicações específicas ' +
      'do conjunto das mulheres metalúrgicas. “Uma pauta de fôlego e que teremos que ir pra porta de fábrica conversar com trabalhadores e trabalhadoras visando ' + 
      'mobilizar para conquistar todos os avanços”, define Caminaga.<br><br>Fotos: Adônis Guerra',
      date: '99/99/9999',
      image_post: 'imageNoticias5001',
      images: [
        {
          content: 'imageNoticias5001',
          title: ''
        },
        {
          content: 'imageNoticias5002',
          title: ''
        },
      ]
    },
    {
      title: 'PARCERIA ESPORTIVA DESENVOLVE CRIANÇAS, ADOLESCENTES E JOVENS E OBTÉM RESULTADOS EM COMPETIÇÕES',
      slug: 'parceria-esportiva-desenvolve-criancas-adolescentes-e-jovens-e-obtem-resultados-em-competicoes',
      content: 'O projeto de artes marciais, que tem a parceria do Metal Bauru com a Associação de Artes Marciais Caminaga, acumula resultados expressivos nesse ano de 2025 em campeonatos importantes nas modalidades de judô e jiu-jitsu. Sob supervisão dos técnicos voluntários senseis Elisa, Ciça e Christopher, a equipe desempenha importante trabalho impulsionando atletas a almejar pódio em competições importantes como Sul brasileiro, Copa São Paulo de Judô, Campeonato Paulista de Judô, seletiva do J.E.E.S.P., Open Ajinomoto, C.I.J.J.( jiu-jitsu). As conquistas são referência em Bauru e região, confirmando o sucesso da parceria Associação e sindicato para manter o projeto.<br><br>A iniciativa da parceria visa atender as crianças e jovens da comunidade e todos os associados e dependentes do Metal Bauru.<br><br>Fotos: Associação de Artes Marciais Caminaga',
      date: '99/99/9999',
      image_post: 'imageNoticias6001',
      images: [
        {
          content: 'imageNoticias6001',
          title: ''
        },
        {
          content: 'imageNoticias6002',
          title: ''
        },
        {
          content: 'imageNoticias6003',
          title: ''
        },
        {
          content: 'imageNoticias6004',
          title: ''
        },
        {
          content: 'imageNoticias6005',
          title: ''
        },
        {
          content: 'imageNoticias6006',
          title: ''
        },
        {
          content: 'imageNoticias6007',
          title: ''
        },
        {
          content: 'imageNoticias6008',
          title: ''
        },
        {
          content: 'imageNoticias6009',
          title: ''
        },
        {
          content: 'imageNoticias6010',
          title: ''
        },
        {
          content: 'imageNoticias6011',
          title: ''
        },
        {
          content: 'imageNoticias6012',
          title: ''
        },
        {
          content: 'imageNoticias6013',
          title: ''
        },
      ]
    },
  ]

  const handlePostClick = (index: number) => {
    console.log(index)
  }

  useEffect(() => {
    setSelectedPageId(null)
  }, [setSelectedPageId])

  const selectedWebsiteClick = (event: React.MouseEvent<HTMLElement>) => {
    const website = allWebsites.find((w) => w.id.toString() === event.currentTarget.id)
    if (website) {
      setSelectedPageId(null)
      setSelectedWebsite(website)
      setSelectedWebsiteId(website.id)
      navigate('/')
    }
  }

  const handleExit = () => {
    setSelectedWebsiteId(null)
    setSelectedPageId(null)
    // setSelectedWebsite(null)
    navigate('/login')
  }

  const handleMenuClick = async (menuId: number) => {
    if (!selectedWebsiteId) {
      console.error('No website selected')
      return
    }

    const apiService = new ApiService()

    if (menuId === 9) {
      const notifications = await apiService.getNotificationByWebsiteId(selectedWebsiteId)
      setNotifications(notifications)
    }

    setSelectedMenu(menuId)
  }

  const handleUserClick = (userId: number) => {
    if (userId === 0) {
      setFirstName('')
      setLastName('')
      setEmail('')
      setIsDefaultSite(false)
      setAccessLevel('')
      setNewUser(true)
    } else {
      setFirstName('Lucas')
      setLastName('da Silva')
      setEmail('lucas@example.com')
      setIsDefaultSite(true)
      setAccessLevel('1')
      setNewUser(false)
    }
    setSelectedUser(userId)
  }

  const setValue = (key: keyof WebsiteType, value: boolean) => {
    if (website?.id == null) {
      return
    }
    updateSelectedWebsiteField(key, value)
  }

  const handleChangePassword = () => {
    alert('Função de alterar senha ainda não implementada.')
  }

  useEffect(() => {
    setSelectedMenu(1)
    const timeoutId = setTimeout(() => {
      const website = allWebsites.find((w) => w.id === selectedWebsiteId)
      if (website) {
        setWebsite(website)
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [allWebsites, selectedWebsiteId, selectedPageId])

  if (!website) {
    return (
      <Main>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <Row className="mt-3 mb-3">
        <Col sm={12} md={12} lg={3} style={{ display: 'none' }}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <BsFillMenuButtonWideFill size={18} />
                  <b>MENU</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2">
                <Dropdown>
                  <Dropdown.Toggle className='krona dropdown-website-select' variant="light" style={{ width: '100%', border: '3px solid #DDD' }}>
                      {selectedWebsiteId ? allWebsites.find((w) => w.id === selectedWebsiteId)?.name : 'Selecione um site'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='krona dropdown-website-select-item' style={{ width: '100%', border: '3px solid #DDD' }}>
                    {allWebsites.map((website) => (
                      <Dropdown.Item onClick={selectedWebsiteClick} id={website.id.toString()} key={website.id} active={website.id === selectedWebsiteId}>
                        {website.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col lg={12} className="mb-2">
                <div className={`website-settings-menu-item ${selectedMenu === 1 ? 'active' : ''}`} onClick={() => handleMenuClick(1)}>
                  <GrConfigure size={18} />
                  <b>Configurações gerais</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2" style={{ display: 'none' }} id='aSerDesenvolvido'>
                <div className={`website-settings-menu-item ${selectedMenu === 2 ? 'active' : ''}`} onClick={() => handleMenuClick(2)}>
                  <TbBoxAlignTopFilled size={18} />
                  <b>Configurações do cabeçalho</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2" style={{ display: 'none' }} id='aSerDesenvolvido'>
                <div className={`website-settings-menu-item ${selectedMenu === 3 ? 'active' : ''}`} onClick={() => handleMenuClick(3)}>
                  <TbBoxAlignBottomFilled size={18} />
                  <b>Configurações do rodapé</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2">
                <div className={`website-settings-menu-item ${selectedMenu === 9 ? 'active' : ''}`} onClick={() => handleMenuClick(9)}>
                  <FaEnvelopeOpenText size={18} />
                  <b>Formulários enviados</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2">
                <div className={`website-settings-menu-item ${selectedMenu === 10 ? 'active' : ''}`} onClick={() => handleMenuClick(10)}>
                  <TbPencil size={18} />
                  <b>Posts</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 4 ? 'active' : ''}`} onClick={() => handleMenuClick(4)}>
                  <FaUsersGear size={18} />
                  <b>Gerenciar usuários</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 5 ? 'active' : ''}`}  onClick={() => handleMenuClick(5)}>
                  <TbPlugConnectedX size={18} />
                  <b>Integrações</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 6 ? 'active' : ''}`} onClick={() => handleMenuClick(6)}>
                  <IoFileTrayStacked size={18} />
                  <b>Meus arquivos</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 7 ? 'active' : ''}`} onClick={() => handleMenuClick(7)}>
                  <MdOutlineHistory size={18} />
                  <b>Histórico de alterações</b>
                </div>
              </Col>
              <Col id='aSerDesenvolvido' lg={12} className="mb-2" style={{ display: 'none' }}>
                <div className={`website-settings-menu-item ${selectedMenu === 8 ? 'active' : ''}`} onClick={() => handleMenuClick(8)}>
                  <RiBankLine size={18} />
                  <b>Meu plano</b>
                </div>
              </Col>
              <Col lg={12} className="mb-2">
                <div className={`website-settings-menu-item ${selectedMenu === 8 ? 'active' : ''}`} onClick={() => handleExit()}>
                  <ImExit size={18} />
                  <b>Sair</b>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={12} md={12} lg={12} className="mt-md-0 mt-3">
          <div id='websiteSettings' className="website-card" style={{ display: selectedMenu === 1 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans">
                  <GrConfigure size={18} />
                  <b>CONFIGURAÇÕES GERAIS</b>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Row>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Nome</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.name} />
                    </InputGroup>
                  </Col>
                  <Col lg={6}>
                    <Form.Label htmlFor="basic-url">Endereço</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.domain} readOnly />
                    </InputGroup>
                  </Col>
                  <Col lg={6}>
                    <Form.Label htmlFor="basic-url">Endereço de homologação</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.domainStage} readOnly />
                    </InputGroup>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">E-mail de notificação</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
                  </Col>
                  <Col lg={12} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <div className='website-card-header krona mb-2'>
                      REDES SOCIAIS
                    </div>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">Instagram</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.properties.social.instagram.path} />
                    </InputGroup>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">Facebook</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.properties.social.facebook.path} />
                    </InputGroup>
                  </Col>
                  <Col lg={12} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <div className='website-card-header krona mb-2'>
                      ESTILO
                    </div>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">Cor padrão do texto</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.styles.color} />
                    </InputGroup>
                  </Col>
                  <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                    <Form.Label htmlFor="basic-url">Cor de fundo</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" value={website.styles.backgroundColor} />
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
              <Col lg={6} style={{ display: 'none' }} id='aSerDesenvolvido'>
                <Row>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Logo</Form.Label>
                    <InputGroup className="mb-3">
                      <Image
                        src={`https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/${website?.logo}`}
                        style={{ objectFit: 'cover', maxWidth: '250px' }}
                      />
                    </InputGroup>
                  </Col>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Imagem de fundo</Form.Label>
                    <InputGroup className="mb-3">
                      <Image
                        src={website.styles.backgroundImage}
                        style={{ objectFit: 'cover', maxWidth: '500px' }}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div id='headerSettings' className="website-card" style={{ display: selectedMenu === 2 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <TbBoxAlignTopFilled size={18} />
                  <b>CONFIGURAÇÕES DO CABEÇALHO</b>
                </div>
              </Col>
              <Col lg={6}>
                <div style={{ minHeight: '300px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  <Row>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        LOGO
                      </div>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="componentEnabledSwitch">
                        <Form.Label>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Exibir
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-component-enabled">Exibir a logo no cabeçalho do site.</Tooltip>
                              }
                            >
                              <span className="website-info">
                                <FaInfoCircle size={14} />
                              </span>
                            </OverlayTrigger>
                          </span>
                        </Form.Label>
                        <div style={{ display: 'flex', marginTop: '8px' }}>
                          <Switch
                            onChange={(checked) => setValue('header', checked)}
                            checked={!!website.header.properties.showLogo}
                            className="react-switch"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Alinhamento</Form.Label>
                        <Form.Select aria-label="Selecione">
                          <option value="">Selecione</option>
                          <option value="1">Esquerda</option>
                          <option value="2">Centro</option>
                          <option value="3">Direita</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        ESTILO
                      </div>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Cor de fundo</Form.Label>
                        <Form.Control
                          type="color"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={6} className='ps-0'>
                <div style={{ minHeight: '300px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  <Col lg={12}>
                    <div className='website-card-header krona mb-2'>
                      MENU
                    </div>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mb-3" controlId="componentEnabledSwitch">
                      <Form.Label>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          Exibir
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="tooltip-component-enabled">Exibir o menu no cabeçalho do site.</Tooltip>
                            }
                          >
                            <span className="website-info">
                              <FaInfoCircle size={14} />
                            </span>
                          </OverlayTrigger>
                        </span>
                      </Form.Label>
                      <div style={{ display: 'flex', marginTop: '8px' }}>
                        <Switch
                          onChange={(checked) => setValue('header', checked)}
                          checked={false}
                          className="react-switch"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg={12}>
                    <div className='website-card-header krona mb-2'>
                      ESTILO
                    </div>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mb-3" controlId="pageName">
                      <Form.Label>Cor de fundo</Form.Label>
                      <Form.Control
                        type="color"
                      />
                    </Form.Group>
                  </Col>
                </div>
              </Col>
              <Col lg={12} className='mt-3'>
                <b>Pré-visualização do cabeçalho:</b>
              </Col>
              <Col lg={12} className='mt-2'>
                <Header website={website} />
              </Col>
            </Row>
          </div>
          <div id='footerSettings' className="website-card" style={{ display: selectedMenu === 3 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <TbBoxAlignBottomFilled size={18} />
                  <b>CONFIGURAÇÕES DO RODAPÉ</b>
                </div>
              </Col>
              <Col lg={6}>
                <div style={{ minHeight: '300px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  <Row>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        INFORMAÇÕES
                      </div>
                    </Col>
                    <Col lg={2}>
                      <Form.Group className="mb-3" controlId="componentEnabledSwitch">
                        <Form.Label>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Exibir
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-component-enabled">Exibir a logo no cabeçalho do site.</Tooltip>
                              }
                            >
                              <span className="website-info">
                                <FaInfoCircle size={14} />
                              </span>
                            </OverlayTrigger>
                          </span>
                        </Form.Label>
                        <div style={{ display: 'flex', marginTop: '8px' }}>
                          <Switch
                            onChange={(checked) => setValue('header', checked)}
                            checked={!!website.header.properties.showLogo}
                            className="react-switch"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Texto</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        ESTILO
                      </div>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Cor de fundo</Form.Label>
                        <Form.Control
                          type="color"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={6} className='ps-0'>
                <div style={{ minHeight: '300px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  <Row>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        ÍCONES SOCIAIS
                      </div>
                    </Col>
                    <Col lg={2}>
                      <Form.Group className="mb-3" controlId="componentEnabledSwitch">
                        <Form.Label>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Exibir
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-component-enabled">Exibir o menu no cabeçalho do site.</Tooltip>
                              }
                            >
                              <span className="website-info">
                                <FaInfoCircle size={14} />
                              </span>
                            </OverlayTrigger>
                          </span>
                        </Form.Label>
                        <div style={{ display: 'flex', marginTop: '8px' }}>
                          <Switch
                            onChange={(checked) => setValue('header', checked)}
                            checked={false}
                            className="react-switch"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Alinhamento</Form.Label>
                        <Form.Select aria-label="Selecione">
                          <option value="">Selecione</option>
                          <option value="1">Esquerda</option>
                          <option value="2">Centro</option>
                          <option value="3">Direita</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <div className='website-card-header krona mb-2'>
                        ESTILO
                      </div>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className="mb-3" controlId="pageName">
                        <Form.Label>Cor do ícone</Form.Label>
                        <Form.Control
                          type="color"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={12} className='mt-3'>
                <b>Pré-visualização do rodapé:</b>
              </Col>
              <Col lg={12} className='mt-2'>
                <Footer website={website} />
              </Col>
            </Row>
          </div>
          <div id='websiteSettings' className="website-card" style={{ display: selectedMenu === 9 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <FaEnvelopeOpenText size={18} />
                  <b>FORMULÁRIOS ENVIADOS</b>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div style={{ border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px' }}>
                  {notifications.map((notification, index) => (
                    <Row key={index} className='notification-item'>
                      <Col lg={2}>
                        <div className='notification-date' style={{  }}>
                          {notification.created_at && (
                            <Row className="text-center">
                              <Col lg={12}>
                                {new Date(
                                  new Date(notification.created_at).getTime() - 3 * 60 * 60 * 1000
                                ).toLocaleDateString('pt-BR')}
                              </Col>
                              <Col lg={12}>
                                {new Date(
                                  new Date(notification.created_at).getTime() - 3 * 60 * 60 * 1000
                                ).toLocaleTimeString('pt-BR')}
                              </Col>
                            </Row>
                          )}
                        </div>
                      </Col>
                      <Col lg={10}>
                        <div key={index} style={{ fontSize: '18px', whiteSpace: 'pre-line', padding: '10px' }}>
                          {JSON.parse(notification.message).message.split('\n').map((line: string, i: number) => {
                            const regexLink = /(https?:\/\/[^\s]+)/g;
                            const textoComLinks = line.replace(regexLink, '<a href="$1" target="_blank">Visualizar</a>');

                            return (<div dangerouslySetInnerHTML={{ __html: textoComLinks }} key={i} />)
                          })}
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
          <div id='userManagement' className="website-card" style={{ display: selectedMenu === 4 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <FaUsersGear size={18} />
                  <b>GERENCIAR USUÁRIOS</b>
                </div>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={5}>
                    <div className={`website-settings-menu-item mb-2 ${selectedUser === 1 ? 'active' : ''}`} onClick={() => handleUserClick(1)}>
                      <div>
                        <Image src="./public/user_avatar.png" rounded style={{ maxWidth: '50px', height: 'auto' }}/>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>Lucas da Silva</span>
                        <span style={{ fontSize: '14px', color: '#888888', fontWeight: 'bold' }}>lucas.2601@gmail.com</span>
                      </div>
                    </div>

                    <div className={`website-settings-menu-item mb-2`} onClick={() => handleUserClick(0)}
                      style={{ border: '3px dashed #EEE', color: '#888888', justifyContent: 'center', fontWeight: 'bold' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}><MdAddCircle /> Criar novo usuário</span>
                      </div>
                    </div>
                  </Col>
                  <Col lg={7} style={{ display: selectedUser !== 0 || newUser ? 'block' : 'none' }}>
                    <div className='mb-2' style={{ display: 'flex', gap: '10px', border: '3px solid #EEEEEE', padding: '10px', borderRadius: '5px' }}>
                      <Row>
                        <Col lg={6}>
                          <Row>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Nome</Form.Label>
                              <InputGroup className="mb-2">
                                <Form.Control id="basic-url" aria-describedby="basic-addon3" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                              </InputGroup>
                            </Col>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Sobrenome</Form.Label>
                              <InputGroup className="mb-2">
                                <Form.Control id="basic-url" aria-describedby="basic-addon3" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                              </InputGroup>
                            </Col>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Email</Form.Label>
                              <InputGroup className="mb-2">
                                <Form.Control id="basic-url" aria-describedby="basic-addon3" readOnly={!newUser} value={email} onChange={(e) => setEmail(e.target.value)} />
                              </InputGroup>
                            </Col>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Nível de acesso</Form.Label>
                              <Form.Select aria-label="Selecione" className="mb-2" value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="1">Administrador</option>
                                <option value="2">Editor</option>
                                <option value="3">Analista</option>
                                <option value="4">Colaborador</option>
                                <option value="5">Visualizador</option>
                              </Form.Select>
                            </Col>
                            <Col lg={6}>
                              <Form.Label htmlFor="basic-url">Site padrão</Form.Label>
                              <Form.Select aria-label="Selecione" value={isDefaultSite ? "1" : "2"} onChange={(e) => setIsDefaultSite(e.target.value === "1")}>
                                <option value="">Selecione</option>
                                <option value="1">Sim</option>
                                <option value="2">Não</option>
                              </Form.Select>
                            </Col>
                            <Col lg={6}>
                              <Form.Label htmlFor="basic-url">Ativo</Form.Label>
                              <Form.Select aria-label="Selecione" value='false'>
                                <option value="">Selecione</option>
                                <option value="1">Sim</option>
                                <option value="2">Não</option>
                              </Form.Select>
                            </Col>
                            <Col lg={12} className='mt-3'>
                              <Alert variant='warning' style={{ display: selectedUser === 1 ? 'none' : 'block' }}>
                                Ao criar um usuário, ele receberá um e-mail para definir a senha de acesso.
                              </Alert>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6}>
                          <Row>
                            <Col lg={12}>
                              <Form.Label htmlFor="basic-url">Foto</Form.Label>
                              <InputGroup className="mb-2 text-center" style={{ justifyContent: 'center' }}>
                                <Image src="./public/user_avatar.png" rounded style={{ maxWidth: '100%', height: 'auto' }}/>
                              </InputGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={12}>
                          <Button variant="success" className='me-2'>Salvar</Button>
                          <Button variant='outline-secondary' className='me-2' onClick={() => handleChangePassword()} style={{ display: newUser ? 'none' : '' }}>
                            Alterar senha
                          </Button>
                          <Button variant="danger" style={{ display: newUser ? 'none' : '' }}>
                            Excluir
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div id='integrationSettings' className="website-card" style={{ display: selectedMenu === 5 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <TbPlugConnectedX size={18} />
                  <b>INTEGRAÇÕES</b>
                </div>
              </Col>
              <Col lg={12}>
                Google Analytics
              </Col>
            </Row>
          </div>
          <div id='fileManagement' className="website-card" style={{ display: selectedMenu === 6 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <IoFileTrayStacked size={18} />
                  <b>MEUS ARQUIVOS</b>
                </div>
              </Col>
              <Col lg={5}>
                <Row>
                  <Col lg={12} className='mt-2 mb-2'>
                    <b>Espaço utilizado:</b> 95% (4.75 GB de 5 GB)
                  </Col>
                  <Col lg={12} className='mb-3'>
                    <ProgressBar>
                      <ProgressBar striped variant="success" now={70} key={1} />
                      <ProgressBar striped variant="warning" now={20} key={2} />
                      <ProgressBar striped variant="danger" now={5} key={3} />
                    </ProgressBar>
                  </Col>
                  <Col lg={12} className='mb-2'>
                    <b>Arquivos:</b>
                  </Col>
                  <Col lg={12}>
                    <div className={`website-settings-menu-item mb-2 ${selectedFileType === 1 ? 'active' : ''}`} onClick={() => setSelectedFileType(1)}>
                      <div>
                        <FaFilePdf />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span>
                          <b>PDF</b>
                        </span>
                        <span style={{ marginLeft: 'auto' }}>
                          4 / 3.27 Gb
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className={`website-settings-menu-item mb-2 ${selectedFileType === 2 ? 'active' : ''}`} onClick={() => setSelectedFileType(2)}>
                      <div>
                        <FaFileImage />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span>
                          <b>Imagens</b>
                        </span>
                        <span style={{ marginLeft: 'auto' }}>
                          2 / 2.55 Gb
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg={7} className='text-center'>
                <div style={{ minHeight: '400px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px', display: selectedFileType === 1 ? 'block' : 'none' }}>
                  <Row>
                    <Col lg={3}>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <FaFilePdf size={40} />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="#" target='_blank'>CT_CleanFoods.pdf</a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={3} className='ps-0'>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <FaFilePdf size={40} />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="#" target='_blank'>CT_CleanFoods1.pdf</a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={3} className='ps-0'>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <FaFilePdf size={40} />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="#" target='_blank'>CT_CleanFoods2.pdf</a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={3} className='ps-0'>
                      <div style={{ border: '2px solid #fabdbdff', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <FaFilePdf size={40} />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="#" target='_blank'>CT_CleanFoods3.pdf</a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div style={{ minHeight: '400px', border: '3px solid #EEEEEE', borderRadius: '5px', padding: '10px', display: selectedFileType === 2 ? 'block' : 'none' }}>
                  <Row>
                    <Col lg={3}>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <Image
                              src="https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/logo_ctcleanfoods.png"
                              style={{ objectFit: 'cover', maxWidth: '150px' }}
                            />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/logo_ctcleanfoods.png" target='_blank'>
                              logo_ctcleanfoods.png
                            </a>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col lg={3} className='ps-0'>
                      <div style={{ border: '1px solid #BBBBBB', borderRadius: '5px',padding: '10px' }}>
                        <Row>
                          <Col lg={12} style={{ padding: '10px' }}>
                            <Image
                              src="https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/background_ctcleanfoods.png"
                              style={{ objectFit: 'cover', maxWidth: '150px' }}
                            />
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            <a href="https://noisdev-website-images.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/background_ctcleanfoods.png" target='_blank'>
                              background_ctcleanfoods.png
                            </a>
                          </Col>
                          <Col lg={12} style={{ fontSize: '12px' }}>
                            1.05 Mb
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div id='changeHistory' className="website-card" style={{ display: selectedMenu === 7 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <MdOutlineHistory size={18} />
                  <b>HISTÓRICO DE ALTERAÇÕES</b>
                </div>
              </Col>
            </Row>
          </div>
          <div id='planSettings' className="website-card" style={{ display: selectedMenu === 8 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <RiBankLine size={18} />
                  <b>MEU PLANO</b>
                </div>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor="basic-url">Plano</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor="basic-url">Início</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor="basic-url">Fim</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor="basic-url">Histórico de pagamentos</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                </InputGroup>
              </Col>
            </Row>
          </div>
          <div id='planSettings' className="website-card" style={{ display: selectedMenu === 10 ? 'block' : 'none' }}>
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header krona">
                  <TbPencil size={18} />
                  <b>POSTS</b>
                </div>
              </Col>
              <Col lg={4}>
                <Row>
                  <Col lg={12}>
                    <div className="mb-2 website-settings-menu-item">
                      <TbPencilPlus size={18} /> Criar novo post
                    </div>
                  </Col>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Todos os posts</Form.Label>
                    {posts.map((post, index) => (
                      <div key={index} className="mb-2 website-settings-menu-item" onClick={() => handlePostClick(index)}>
                        <Row>
                          <Col lg={12} style={{ fontSize: '14px', color: '#A1A1A1', fontWeight: 'bold' }}>
                            Data: {post.date}
                          </Col>
                          <Col lg={12}>
                            {post.title || 'Título não definido'}
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Col>
                </Row>
              </Col>
              <Col lg={8}>
                <Row>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Título</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
                  </Col>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Imagens</Form.Label>
                    <div style={{ border: '1px solid #DDD', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
                      <Row>
                        <Col lg={3} className='mb-2'>
                          <Image src='https://placehold.co/200' />
                        </Col>
                        <Col lg={3} className='mb-2'>
                          <Image src='https://placehold.co/200' />
                        </Col>
                        <Col lg={3} className='mb-2'>
                          <Image src='https://placehold.co/200' />
                        </Col>
                        <Col lg={3} className='mb-2'>
                          <Image src='https://placehold.co/200' />
                        </Col>
                        <Col lg={3} className='mb-2'>
                          <Image src='https://placehold.co/200' />
                        </Col>
                        <Col lg={3} className='mb-2'>
                          <Image src='https://placehold.co/200' />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <Form.Label htmlFor="basic-url">Texto</Form.Label>
                    <Form.Control as="textarea" rows={22} />
                  </Col>
                  <Col lg={12} className='mt-2'>
                    <Button variant="success" className='me-2'>Salvar</Button>
                    <Button variant="danger">Excluir</Button>
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
