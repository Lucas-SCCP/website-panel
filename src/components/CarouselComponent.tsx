import { Row } from 'react-bootstrap';
import type { ComponentType } from 'website-lib';

export default function ButtonComponent(props: { component: ComponentType  }) {
  return (
    <Row>
      {props.component.id}
    </Row>
  )
}