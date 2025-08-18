import { Row } from 'react-bootstrap'
import type { ComponentType } from 'website-lib'

export function CarouselComponent(props: { component: ComponentType }) {
  return <Row>{props.component.id}</Row>
}
