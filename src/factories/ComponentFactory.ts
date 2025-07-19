import React from 'react'
import { ComponentTypeEnum } from '../enums/ComponentTypeEnum'
import type { ComponentType } from 'website-lib'
import { ListComponent } from '../components/ListComponent'
import { TextComponent } from '../components/TextComponent'
import { FormComponent } from '../components/FormComponent'
import { CarouselComponent } from '../components/CarouselComponent'

class ComponentFactory {
  build(component: ComponentType): React.ReactElement | null {
    switch (component.component_type_id) {
      case ComponentTypeEnum.Text:
        return React.createElement(TextComponent, { component })
      case ComponentTypeEnum.List:
        return React.createElement(ListComponent, { component })
      case ComponentTypeEnum.Form:
        return React.createElement(FormComponent, { component })
      case ComponentTypeEnum.Carousel:
        return React.createElement(CarouselComponent, { component })
      default:
        return null
    }
  }
}

export { ComponentFactory }
