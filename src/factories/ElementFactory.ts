import React from 'react'
import { ElementTypeEnum } from '../enums/ElementTypeEnum'
import { TextElement } from '../elements/TextElement'
import { InputElement } from '../elements/InputElement'
import { AlertElement } from '../elements/AlertElement'
import { ButtonElement } from '../elements/ButtonElement'
import { LinkElement } from '../elements/LinkElement'
import { IconElement } from '../elements/IconElement'
import type { ElementType } from 'website-lib'

class ElementFactory {
  build(type: number, element: ElementType): React.ReactElement | null {
    switch (type) {
      case ElementTypeEnum.Text:
        return React.createElement(TextElement, { element })
      case ElementTypeEnum.Input:
        return React.createElement(InputElement, { element })
      case ElementTypeEnum.Alert:
        return React.createElement(AlertElement, { element })
      case ElementTypeEnum.Button:
        return React.createElement(ButtonElement, { element })
      case ElementTypeEnum.Link:
        return React.createElement(LinkElement, { element })
      case ElementTypeEnum.Icon:
        return React.createElement(IconElement, { element })
      default:
        return null
    }
  }

  friendlyFieldName(field: string): string {
    const fieldMap: Record<string, string> = {
    title: 'Título',
    name: 'Nome',
    backgroundColor: 'Cor de fundo',
    width: 'Largura',
    height: 'Altura',
    display: 'Display',
    alignItems: 'Alinhamento de itens',
    color: 'Cor da fonte',
    fontSize: 'Tamanho da fonte',
    fontWeight: 'Peso da fonte',
    textAlign: 'Alinhamento do texto',
    borderColor: 'Cor da borda',
    borderWidth: 'Largura da borda',
    borderRadius: 'Raio da borda',
    borderStyle: 'Estilo da borda',
    marginTop: 'Margem superior',
    marginBottom: 'Margem inferior',
    marginLeft: 'Margem esquerda',
    marginRight: 'Margem direita',
    paddingTop: 'Preenchimento superior',
    paddingBottom: 'Preenchimento inferior',
    paddingLeft: 'Preenchimento esquerdo',
    paddingRight: 'Preenchimento direito',
  };

  return fieldMap[field] ?? field;
  }

  friendlyValue(field: string, value: string): string {
    console.log('changeValues', field, value)
    if (field === 'size') {
      switch (value) {
        case '12':
          return '100%';
        case '11':
          return '91%';
        case '10':
          return '83%';
        case '9':
          return '75%';
        case '8':
          return '66%';
        case '7':
          return '58%';
        case '6':
          return '50%';
        case '5':
          return '41%';
        case '4':
          return '33%';
        case '3':
          return '25%';
        case '2':
          return '16%';
        case '1':
          return '8%';
        default:
          return field;
      }
    }
    if (value === 'true') {
      value = 'Sim'
    } else if (value === 'false') {
      value = 'Não'
    }
    return value
  }
}

export { ElementFactory }
