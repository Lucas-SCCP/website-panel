class PageFactory {

  friendlyFieldName(field: string): string {
    switch (field) {
      case 'name':
        return 'Nome'
      case 'title':
        return 'Título'
      case 'path':
        return 'Página inicial'
      case 'enabled':
        return 'Habilitado'
      case 'menu':
        return 'Menu'
      case 'menu_order':
        return 'Posição no menu'
      default:
        return field;
    }
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

export { PageFactory }
