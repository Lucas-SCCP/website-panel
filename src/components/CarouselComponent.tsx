import { Row } from 'react-bootstrap';
import type { Component } from '../types/Website';

export default function ButtonComponent(props: { component: Component  }) {
  return (
    <Row>
      {props.component.id}
    </Row>
  )
}