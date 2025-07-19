import { useState, type JSX } from 'react';
import { Row, Col, Accordion, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

import type { Component as ComponentType } from '../types/Website';

import { componentFactory } from '../factories/ComponentFactory';

import { FaListUl, FaInfoCircle, FaTextHeight } from "react-icons/fa";
import { RiInputField } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { TbSwitchVertical } from "react-icons/tb";

export default function Component(component: ComponentType & { index: number}) {
  const [componentName, setComponentName] = useState(component.name);
  const [componentSort, setComponentSort] = useState(component.sort);
  const [componentSize, setComponentSize] = useState(component.size);
  const [componentEnabled, setComponentEnabled] = useState(component.enabled);

  function getIconByComponentType(type: number): JSX.Element {
    switch (type) {
      case 14:
        return <FaTextHeight size={18} />;
      case 15:
        return <FaListUl size={18} />;
      case 16:
        return <RiInputField size={18} />;
      default:
        return <FaTextHeight size={18} />;
    }
  }

  function handleDeleteComponent(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
    event.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este componente?')) {
      console.log(`Component with index ${component.index} would be deleted.`);
    }
  }

  return (
    <Accordion.Item eventKey={component.index.toString()} className='mb-3 website-accordion-selected website-accordion-header-border-radius'>
      <Accordion.Header className='website-accordion-header-button website-accordion-header-button-bg-gray'>
        <div className='website-accordion-header-title-container'>
          <div className='website-accordion-header-title'>
            {getIconByComponentType(component.component_type_id)} - <b>{component.name}</b>
          </div>
        </div>
        <span className="ms-auto website-accordion-header-action-buttons">
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="tooltip-delete-component">
                Excluir componente
              </Tooltip>
            }
          >
            <span onClick={handleDeleteComponent}>
              <TiDelete size={20} style={{ color: 'red' }} />
            </span>
          </OverlayTrigger>
        </span>
        <span className="ms-auto website-accordion-header-action-buttons">
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="tooltip-drag-component">
                Arraste para alterar a ordenação
              </Tooltip>
            }
          >
            <span>
              <TbSwitchVertical size={18}/>
            </span>
          </OverlayTrigger>
        </span>
      </Accordion.Header>
      <Accordion.Body>
        <Row id='component-settings'>
          <Col lg={12}>
            <Form.Group className="mb-3" controlId="componentName">
              <Form.Label>
                Nome do componente
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite um nome para o componente"
                value={componentName}
                onChange={e => setComponentName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="mb-3" controlId="componentSort">
              <Form.Label>
                Posição do componente
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite uma posição para o componente"
                value={componentSort}
                onChange={e => setComponentSort(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="mb-3" controlId="componentSize">
              <Form.Label>
                Tamanho do componente
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o tamanho do componente"
                value={componentSize}
                onChange={e => setComponentSize(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="mb-3" controlId="componentEnabledSwitch">
              <Form.Check
                type="switch"
                checked={componentEnabled}
                onChange={e => setComponentEnabled(e.target.checked)}
                id="componentEnabledSwitch"
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Habilitado
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-component-enabled">
                          Ative para exibir esse componente no site.
                        </Tooltip>
                      }
                    >
                      <span className='website-info'>
                        <FaInfoCircle size={14} />
                      </span>
                    </OverlayTrigger>
                  </span>
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row id='component-edit'>
          <Accordion>
            {componentFactory(component)}
          </Accordion>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  )
}