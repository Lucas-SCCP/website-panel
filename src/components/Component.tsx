import { Row, Col, Accordion, Form, Dropdown } from 'react-bootstrap';

export default function Pages() {
  return (
    <Row>
      <Col lg={12} style={{ marginTop: '10px' }}>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Componente - Texto</Accordion.Header>
            <Accordion.Body>
              <Col lg={12}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Nome do componente
                  </Form.Label>
                  <Form.Control type="text" placeholder="Digite um nome para o componente" />
                </Form.Group>
              </Col>
              <Col lg={12}>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Elemento - Texto</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Texto
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          Estilo
                          <hr />
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Cor
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Tamanho da fonte
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Elemento - Texto</Accordion.Header>
                    <Accordion.Body>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat. Duis aute irure dolor in
                      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Elemento - Texto</Accordion.Header>
                    <Accordion.Body>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat. Duis aute irure dolor in
                      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Elemento - Texto</Accordion.Header>
                    <Accordion.Body>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat. Duis aute irure dolor in
                      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

      <Col lg={12} style={{ marginTop: '10px' }}>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Componente - Lista</Accordion.Header>
            <Accordion.Body>
              <Col lg={12}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Nome do componente
                  </Form.Label>
                  <Form.Control type="text" placeholder="Digite um nome para o componente" />
                </Form.Group>
              </Col>
              <Col lg={12}>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Elemento - Item</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Ícone
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Texto
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          Estilo
                          <hr />
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Cor
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Tamanho da fonte
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

      <Col lg={12} style={{ marginTop: '10px' }}>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Componente - Formulário</Accordion.Header>
            <Accordion.Body>
              <Col lg={12}>
                <Form.Group className="mb-3" controlId="pageName">
                  <Form.Label>
                    Nome do componente
                  </Form.Label>
                  <Form.Control type="text" placeholder="Digite um nome para o componente" />
                </Form.Group>
              </Col>
              <Col lg={12}>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Elemento - Texto</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Título do formulário
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto de título do formulário" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          Estilo
                          <hr />
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Cor
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Tamanho da fonte
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Elemento - Input</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Nome do campo
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto de título do formulário" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Placeholder
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto de placeholder" />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Tipo de input
                            </Form.Label>
                            <Dropdown style={{ width: '100%' }}>
                              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
                                Selecione
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{ width: '100%' }}>
                                <Dropdown.Item href="#">Texto</Dropdown.Item>
                                <Dropdown.Item href="#">Número</Dropdown.Item>
                                <Dropdown.Item href="#">Email</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Tipo de validação
                            </Form.Label>
                            <Dropdown style={{ width: '100%' }}>
                              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
                                Selecione
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{ width: '100%' }}>
                                <Dropdown.Item href="#">Nome</Dropdown.Item>
                                <Dropdown.Item href="#">Telefone</Dropdown.Item>
                                <Dropdown.Item href="#">Email</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          Estilo
                          <hr />
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Cor
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Tamanho da fonte
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Elemento - Link</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Texto
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto para o link" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Selecione um arquivo</Form.Label>
                            <Form.Control type="file" />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Elemento - Botão</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Texto do botão
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto do botão" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Texto de carregamento
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto de carregamento do botão" />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Tipo de botão
                            </Form.Label>
                            <Dropdown style={{ width: '100%' }}>
                              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
                                Selecione
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{ width: '100%' }}>
                                <Dropdown.Item href="#">Submit</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Ação
                            </Form.Label>
                            <Dropdown style={{ width: '100%' }}>
                              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
                                Selecione
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{ width: '100%' }}>
                                <Dropdown.Item href="#">Envio de e-mail</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Mensagem de sucesso
                            </Form.Label>
                            <Dropdown style={{ width: '100%' }}>
                              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
                                Selecione
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{ width: '100%' }}>
                                <Dropdown.Item href="#">Exibir alertas</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Ação após clique
                            </Form.Label>
                            <Dropdown style={{ width: '100%' }}>
                              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{ width: '100%' }}>
                                Selecione
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{ width: '100%' }}>
                                <Dropdown.Item href="#">Exibir botão</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          Estilo
                          <hr />
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Cor
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Tamanho da fonte
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="4">
                    <Accordion.Header>Elemento - Mensagem</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="pageName">
                            <Form.Label>
                              Título do formulário
                            </Form.Label>
                            <Form.Control type="text" placeholder="Digite o texto de título do formulário" />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          Estilo
                          <hr />
                          <Row>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Cor
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                            <Col lg={6}>
                              <Form.Group className="mb-3" controlId="pageName">
                                <Form.Label>
                                  Tamanho da fonte
                                </Form.Label>
                                <Form.Control type="text" placeholder="Digite o texto" />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Row>
    );
  }