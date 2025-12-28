import type {
  RawWebsiteType,
  WebsiteType,
  PageType,
  ComponentType,
  ElementType,
  AuthenticateResponseType,
  TextAlign,
  FontWeight
} from 'website-lib'
import type { NotificationType } from '../types/NotificationType'
import type { DashboardType } from '../types/DashboardType'
import type { FormsType } from '../types/FormsType'
import type { LeadsType } from '../types/LeadsType'
import type { ValidateTokenResponseType } from '../types/ValidateTokenType'
import { AuthenticateException } from '../exceptions/AuthenticateException'

class ApiService {
  // Primeira requisição, para realizar o login
  async authenticate(email: string, password: string): Promise<AuthenticateResponseType> {
    const data = {
      email: email,
      password: password
    }
    const response = await fetch(`${import.meta.env.VITE_API}/users/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const responseJson = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticateException(responseJson.message)
      }

      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return responseJson
  }

  async getStructure(id: string | number): Promise<WebsiteType> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/website/${id}/structure`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const json = await response.json()

      return this.parseWebsiteResponse(json.data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        // @todo salvar o erro no log error.message
        throw new Error('Erro ao buscar dados da API')
      } else {
        throw new Error('Erro desconhecido na API')
      }
    }
  }

  // Segunda requisição, para obter os dados dos websites que o usuário tem acesso
  async getAllWebsiteByUserId(userId: number, userToken: string): Promise<WebsiteType[]> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/website/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const json = await response.json()

      console.log('JSON', json)

      const websites: WebsiteType[] = json.data.map((rawWebsite: RawWebsiteType) => this.parseWebsiteResponse(rawWebsite))

      console.log('RAWTYPE', websites)

      return websites
    } catch (error: unknown) {
      if (error instanceof Error) {
        // @todo salvar o erro no log error.message
        throw new Error('Ops! Ocorreu um erro, entre em contato com o suporte.')
      } else {
        throw new Error('Erro desconhecido na API')
      }
    }
  }

  async updateWebsite(website: WebsiteType): Promise<WebsiteType> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/website/${website.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(website)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const json = await response.json()
      return this.parseWebsiteResponse(json.data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to update website: ${error.message}`)
      }
      throw new Error('Failed to update website: Unknown error')
    }
  }

  async refreshWebsiteData(websiteId: number): Promise<WebsiteType> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/website/${websiteId}/structure`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const json = await response.json()
      return this.parseWebsiteResponse(json.data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to refresh website data: ${error.message}`)
      }
      throw new Error('Failed to refresh website data: Unknown error')
    }
  }

  parseWebsiteResponse(rawWebsite: RawWebsiteType): WebsiteType {
    const website: WebsiteType = {
      id: rawWebsite.id,
      name: rawWebsite.name,
      domain: rawWebsite.domain,
      domainStage: rawWebsite.domainStage,
      logo: rawWebsite.logo,
      header: {
        properties: {
          logoAlign: rawWebsite.header?.properties?.logoAlign,
          showLogo: rawWebsite.header?.properties?.showLogo,
          showMenu: rawWebsite.header?.properties?.showMenu
        },
        styles: {
          ...(rawWebsite.header.styles.alignItems && { alignItems: rawWebsite.header.styles.alignItems }),
          ...(rawWebsite.header.styles.backgroundColor && { backgroundColor: rawWebsite.header.styles.backgroundColor }),
          ...(rawWebsite.header.styles.borderColor && { borderColor: rawWebsite.header.styles.borderColor }),
          ...(rawWebsite.header.styles.borderRadius && { borderRadius: rawWebsite.header.styles.borderRadius }),
          ...(rawWebsite.header.styles.borderStyle && { borderStyle: rawWebsite.header.styles.borderStyle }),
          ...(rawWebsite.header.styles.borderWidth && { borderWidth: rawWebsite.header.styles.borderWidth }),
          ...(rawWebsite.header.styles.color && { color: rawWebsite.header.styles.color }),
          ...(rawWebsite.header.styles.display && { display: rawWebsite.header.styles.display }),
          ...(rawWebsite.header.styles.float && { float: rawWebsite.header.styles.float }),
          ...(rawWebsite.header.styles.fluid && { fluid: rawWebsite.header.styles.fluid }),
          ...(rawWebsite.header.styles.fontSize && { fontSize: rawWebsite.header.styles.fontSize }),
          ...(rawWebsite.header.styles.fontWeight && { fontWeight: rawWebsite.header.styles.fontWeight as FontWeight }),
          ...(rawWebsite.header.styles.height && { height: rawWebsite.header.styles.height }),
          ...(rawWebsite.header.styles.marginTop && { marginTop: rawWebsite.header.styles.marginTop }),
          ...(rawWebsite.header.styles.marginLeft && { marginLeft: rawWebsite.header.styles.marginLeft }),
          ...(rawWebsite.header.styles.marginRight && { marginRight: rawWebsite.header.styles.marginRight }),
          ...(rawWebsite.header.styles.marginBottom && { marginBottom: rawWebsite.header.styles.marginBottom }),
          ...(rawWebsite.header.styles.objectFit && { objectFit: rawWebsite.header.styles.objectFit }),
          ...(rawWebsite.header.styles.paddingTop && { paddingTop: rawWebsite.header.styles.paddingTop }),
          ...(rawWebsite.header.styles.paddingLeft && { paddingLeft: rawWebsite.header.styles.paddingLeft }),
          ...(rawWebsite.header.styles.paddingRight && { paddingRight: rawWebsite.header.styles.paddingRight }),
          ...(rawWebsite.header.styles.paddingBottom && { paddingBottom: rawWebsite.header.styles.paddingBottom }),
          ...(rawWebsite.header.styles.textAlign && { textAlign: rawWebsite.header.styles.textAlign as TextAlign }),
          ...(rawWebsite.header.styles.width && { width: rawWebsite.header.styles.width }),
        },
      },
      footer: {
        properties: {
          text1: rawWebsite.footer?.properties?.text1,
          text2: rawWebsite.footer?.properties?.text2,
          text3: rawWebsite.footer?.properties?.text3,
        },
        styles: {
          ...(rawWebsite.footer.styles.alignItems && { alignItems: rawWebsite.footer.styles.alignItems }),
          ...(rawWebsite.footer.styles.backgroundColor && { backgroundColor: rawWebsite.footer.styles.backgroundColor }),
          ...(rawWebsite.footer.styles.borderColor && { borderColor: rawWebsite.footer.styles.borderColor }),
          ...(rawWebsite.footer.styles.borderRadius && { borderRadius: rawWebsite.footer.styles.borderRadius }),
          ...(rawWebsite.footer.styles.borderStyle && { borderStyle: rawWebsite.footer.styles.borderStyle }),
          ...(rawWebsite.footer.styles.borderWidth && { borderWidth: rawWebsite.footer.styles.borderWidth }),
          ...(rawWebsite.footer.styles.color && { color: rawWebsite.footer.styles.color }),
          ...(rawWebsite.footer.styles.display && { display: rawWebsite.footer.styles.display }),
          ...(rawWebsite.footer.styles.float && { float: rawWebsite.footer.styles.float }),
          ...(rawWebsite.footer.styles.fluid && { fluid: rawWebsite.footer.styles.fluid }),
          ...(rawWebsite.footer.styles.fontSize && { fontSize: rawWebsite.footer.styles.fontSize }),
          ...(rawWebsite.footer.styles.fontWeight && { fontWeight: rawWebsite.footer.styles.fontWeight as FontWeight }),
          ...(rawWebsite.footer.styles.height && { height: rawWebsite.footer.styles.height }),
          ...(rawWebsite.footer.styles.marginTop && { marginTop: rawWebsite.footer.styles.marginTop }),
          ...(rawWebsite.footer.styles.marginLeft && { marginLeft: rawWebsite.footer.styles.marginLeft }),
          ...(rawWebsite.footer.styles.marginRight && { marginRight: rawWebsite.footer.styles.marginRight }),
          ...(rawWebsite.footer.styles.marginBottom && { marginBottom: rawWebsite.footer.styles.marginBottom }),
          ...(rawWebsite.footer.styles.objectFit && { objectFit: rawWebsite.footer.styles.objectFit }),
          ...(rawWebsite.footer.styles.paddingTop && { paddingTop: rawWebsite.footer.styles.paddingTop }),
          ...(rawWebsite.footer.styles.paddingLeft && { paddingLeft: rawWebsite.footer.styles.paddingLeft }),
          ...(rawWebsite.footer.styles.paddingRight && { paddingRight: rawWebsite.footer.styles.paddingRight }),
          ...(rawWebsite.footer.styles.paddingBottom && { paddingBottom: rawWebsite.footer.styles.paddingBottom }),
          ...(rawWebsite.footer.styles.textAlign && { textAlign: rawWebsite.footer.styles.textAlign as TextAlign }),
          ...(rawWebsite.footer.styles.width && { width: rawWebsite.footer.styles.width }),
        },
      },
      properties: {
        social: rawWebsite.properties.social,
        loadingMessage: rawWebsite.properties.loadingMessage,
      },
      styles: {
        ...(rawWebsite.styles.alignItems && { alignItems: rawWebsite.styles.alignItems }),
        ...(rawWebsite.styles.backgroundImage && { backgroundImage: rawWebsite.styles.backgroundImage }),
        ...(rawWebsite.styles.backgroundGradientColorStart && { backgroundGradientColorStart: rawWebsite.styles.backgroundGradientColorStart }),
        ...(rawWebsite.styles.backgroundGradientColorEnd && { backgroundGradientColorEnd: rawWebsite.styles.backgroundGradientColorEnd }),
        ...(rawWebsite.styles.backgroundPosition && { backgroundPosition: rawWebsite.styles.backgroundPosition }),
        ...(rawWebsite.styles.backgroundColor && { backgroundColor: rawWebsite.styles.backgroundColor }),
        ...(rawWebsite.styles.borderColor && { borderColor: rawWebsite.styles.borderColor }),
        ...(rawWebsite.styles.borderRadius && { borderRadius: rawWebsite.styles.borderRadius }),
        ...(rawWebsite.styles.borderStyle && { borderStyle: rawWebsite.styles.borderStyle }),
        ...(rawWebsite.styles.borderWidth && { borderWidth: rawWebsite.styles.borderWidth }),
        ...(rawWebsite.styles.color && { color: rawWebsite.styles.color }),
        ...(rawWebsite.styles.display && { display: rawWebsite.styles.display }),
        ...(rawWebsite.styles.float && { float: rawWebsite.styles.float }),
        ...(rawWebsite.styles.fontSize && { fontSize: rawWebsite.styles.fontSize }),
        ...(rawWebsite.styles.fontWeight && { fontWeight: rawWebsite.styles.fontWeight as FontWeight }),
        ...(rawWebsite.styles.height && { height: rawWebsite.styles.height }),
        ...(rawWebsite.styles.marginTop && { marginTop: rawWebsite.styles.marginTop }),
        ...(rawWebsite.styles.marginLeft && { marginLeft: rawWebsite.styles.marginLeft }),
        ...(rawWebsite.styles.marginRight && { marginRight: rawWebsite.styles.marginRight }),
        ...(rawWebsite.styles.marginBottom && { marginBottom: rawWebsite.styles.marginBottom }),
        ...(rawWebsite.styles.objectFit && { objectFit: rawWebsite.styles.objectFit }),
        ...(rawWebsite.styles.paddingTop && { paddingTop: rawWebsite.styles.paddingTop }),
        ...(rawWebsite.styles.paddingLeft && { paddingLeft: rawWebsite.styles.paddingLeft }),
        ...(rawWebsite.styles.paddingRight && { paddingRight: rawWebsite.styles.paddingRight }),
        ...(rawWebsite.styles.paddingBottom && { paddingBottom: rawWebsite.styles.paddingBottom }),
        ...(rawWebsite.styles.textAlign && { textAlign: rawWebsite.styles.textAlign as TextAlign }),
        ...(rawWebsite.styles.width && { width: rawWebsite.styles.width }),
      },
      enabled: rawWebsite.enabled,
      publishedAt: rawWebsite.publishedAt,
      createdAt: rawWebsite.createdAt,
      updatedAt: rawWebsite.updatedAt,
      deletedAt: rawWebsite.deletedAt,
      pages: rawWebsite.pages.map(
        (rawPage): PageType => ({
          id: rawPage.id,
          websiteId: rawPage.websiteId,
          title: rawPage.title,
          name: rawPage.name,
          path: rawPage.path,
          menu: rawPage.menu,
          menuOrder: rawPage.menuOrder,
          enabled: rawPage.enabled,
          properties: {
            size: {
              xs: {
                span: rawPage.properties?.size?.xs?.span,
                offset: rawPage.properties?.size?.xs?.offset,
              },
              sm: {
                span: rawPage.properties?.size?.sm?.span,
                offset: rawPage.properties?.size?.sm?.offset
              },
              md: {
                span: rawPage.properties?.size?.md?.span,
                offset: rawPage.properties?.size?.md?.offset
              },
              lg: {
                span: rawPage.properties?.size?.lg?.span,
                offset: rawPage.properties?.size?.lg?.offset
              },
            }
          },
          styles: {
            ...(rawPage.styles.alignItems && { alignItems: rawPage.styles.alignItems }),
            ...(rawPage.styles.backgroundColor && { backgroundColor: rawPage.styles.backgroundColor }),
            ...(rawPage.styles.borderColor && { borderColor: rawPage.styles.borderColor }),
            ...(rawPage.styles.borderRadius && { borderRadius: rawPage.styles.borderRadius }),
            ...(rawPage.styles.borderStyle && { borderStyle: rawPage.styles.borderStyle }),
            ...(rawPage.styles.borderWidth && { borderWidth: rawPage.styles.borderWidth }),
            ...(rawPage.styles.color && { color: rawPage.styles.color }),
            ...(rawPage.styles.display && { display: rawPage.styles.display }),
            ...(rawPage.styles.float && { float: rawPage.styles.float }),
            ...(rawPage.styles.fluid && { fluid: rawPage.styles.fluid }),
            ...(rawPage.styles.fontSize && { fontSize: rawPage.styles.fontSize }),
            ...(rawPage.styles.fontWeight && { fontWeight: rawPage.styles.fontWeight as FontWeight }),
            ...(rawPage.styles.height && { height: rawPage.styles.height }),
            ...(rawPage.styles.marginTop && { marginTop: rawPage.styles.marginTop }),
            ...(rawPage.styles.marginLeft && { marginLeft: rawPage.styles.marginLeft }),
            ...(rawPage.styles.marginRight && { marginRight: rawPage.styles.marginRight }),
            ...(rawPage.styles.marginBottom && { marginBottom: rawPage.styles.marginBottom }),
            ...(rawPage.styles.objectFit && { objectFit: rawPage.styles.objectFit }),
            ...(rawPage.styles.paddingTop && { paddingTop: rawPage.styles.paddingTop }),
            ...(rawPage.styles.paddingLeft && { paddingLeft: rawPage.styles.paddingLeft }),
            ...(rawPage.styles.paddingRight && { paddingRight: rawPage.styles.paddingRight }),
            ...(rawPage.styles.paddingBottom && { paddingBottom: rawPage.styles.paddingBottom }),
            ...(rawPage.styles.textAlign && { textAlign: rawPage.styles.textAlign as TextAlign }),
            ...(rawPage.styles.width && { width: rawPage.styles.width }),
          },
          createdAt: rawPage.createdAt,
          updatedAt: rawPage.updatedAt,
          deletedAt: rawPage.deletedAt,
          components: rawPage.components.map(
            (rawComponent): ComponentType => ({
              id: rawComponent.id,
              pageId: rawComponent.pageId,
              componentTypeId: rawComponent.componentTypeId,
              name: rawComponent.name,
              properties: {
                size: {
                  xs: {
                    span: rawComponent.properties?.size?.xs?.span,
                    offset: rawComponent.properties?.size?.xs?.offset,
                  },
                  sm: {
                    span: rawComponent.properties?.size?.sm?.span,
                    offset: rawComponent.properties?.size?.sm?.offset
                  },
                  md: {
                    span: rawComponent.properties?.size?.md?.span,
                    offset: rawComponent.properties?.size?.md?.offset
                  },
                  lg: {
                    span: rawComponent.properties?.size?.lg?.span,
                    offset: rawComponent.properties?.size?.lg?.offset
                  },
                }
              },
              styles: {
                ...(rawComponent.styles.alignItems && { alignItems: rawComponent.styles.alignItems }),
                ...(rawComponent.styles.backgroundColor && { backgroundColor: rawComponent.styles.backgroundColor }),
                ...(rawComponent.styles.borderColor && { borderColor: rawComponent.styles.borderColor }),
                ...(rawComponent.styles.borderRadius && { borderRadius: rawComponent.styles.borderRadius }),
                ...(rawComponent.styles.borderStyle && { borderStyle: rawComponent.styles.borderStyle }),
                ...(rawComponent.styles.borderWidth && { borderWidth: rawComponent.styles.borderWidth }),
                ...(rawComponent.styles.color && { color: rawComponent.styles.color }),
                ...(rawComponent.styles.display && { display: rawComponent.styles.display }),
                ...(rawComponent.styles.float && { float: rawComponent.styles.float }),
                ...(rawComponent.styles.fontSize && { fontSize: rawComponent.styles.fontSize }),
                ...(rawComponent.styles.fontWeight && { fontWeight: rawComponent.styles.fontWeight as FontWeight }),
                ...(rawComponent.styles.height && { height: rawComponent.styles.height }),
                ...(rawComponent.styles.marginTop && { marginTop: rawComponent.styles.marginTop }),
                ...(rawComponent.styles.marginLeft && { marginLeft: rawComponent.styles.marginLeft }),
                ...(rawComponent.styles.marginRight && { marginRight: rawComponent.styles.marginRight }),
                ...(rawComponent.styles.marginBottom && { marginBottom: rawComponent.styles.marginBottom }),
                ...(rawComponent.styles.objectFit && { objectFit: rawComponent.styles.objectFit }),
                ...(rawComponent.styles.paddingTop && { paddingTop: rawComponent.styles.paddingTop }),
                ...(rawComponent.styles.paddingLeft && { paddingLeft: rawComponent.styles.paddingLeft }),
                ...(rawComponent.styles.paddingRight && { paddingRight: rawComponent.styles.paddingRight }),
                ...(rawComponent.styles.paddingBottom && { paddingBottom: rawComponent.styles.paddingBottom }),
                ...(rawComponent.styles.textAlign && { textAlign: rawComponent.styles.textAlign as TextAlign }),
                ...(rawComponent.styles.width && { width: rawComponent.styles.width }),
              },
              sort: rawComponent.sort,
              enabled: rawComponent.enabled,
              createdAt: rawComponent.createdAt,
              updatedAt: rawComponent.updatedAt,
              deletedAt: rawComponent.deletedAt,
              elements: {
                line: rawComponent.elements?.line ?? 1,
                content: rawComponent.elements?.content
                  ? Object.values(rawComponent.elements.content).map(
                      (rawElement): ElementType => ({
                        id: rawElement.id,
                        componentParent: rawElement.componentParent,
                        componentId: rawElement.componentId,
                        elementTypeId: rawElement.elementTypeId,
                        sort: rawElement.sort,
                        properties: {
                          name: rawElement.properties.name,
                          title: rawElement.properties.title,
                          message: rawElement.properties.message,
                          type: rawElement.properties.type,
                          startHidden: rawElement.properties.startHidden,
                          size: {
                            xs: {
                              span: rawElement.properties?.size?.xs?.span,
                              offset: rawElement.properties?.size?.xs?.offset,
                            },
                            sm: {
                              span: rawElement.properties?.size?.sm?.span,
                              offset: rawElement.properties?.size?.sm?.offset
                            },
                            md: {
                              span: rawElement.properties?.size?.md?.span,
                              offset: rawElement.properties?.size?.md?.offset
                            },
                            lg: {
                              span: rawElement.properties?.size?.lg?.span,
                              offset: rawElement.properties?.size?.lg?.offset
                            },
                          },
                          
                          ...(rawElement.properties.path && { path: rawElement.properties.path }),
                          ...(rawElement.properties.mask && { mask: rawElement.properties.mask }),
                          ...(rawElement.properties.placeholder && { placeholder: rawElement.properties.placeholder }),
                          ...(rawElement.properties.required && { required: rawElement.properties.required }),
                          ...(rawElement.properties.inputValidateId && { inputValidateId: rawElement.properties.inputValidateId }),

                          ...(rawElement.properties.hideOnClick && { hideOnClick: rawElement.properties.hideOnClick }),
                          ...(rawElement.properties.actionId && { actionId: rawElement.properties.actionId }),
                          ...(rawElement.properties.successActionId && { successActionId: rawElement.properties.successActionId }),
                          ...(rawElement.properties.errorActionId && { errorActionId: rawElement.properties.errorActionId }),
                          ...(rawElement.properties.successMessageId && { successMessageId: rawElement.properties.successMessageId }),
                          ...(rawElement.properties.errorMessageId && { errorMessageId: rawElement.properties.errorMessageId }),
                        },
                        styles: {
                          ...(rawElement.styles.alignItems && { alignItems: rawElement.styles.alignItems }),
                          ...(rawElement.styles.backgroundColor && { backgroundColor: rawElement.styles.backgroundColor }),
                          ...(rawElement.styles.borderColor && { borderColor: rawElement.styles.borderColor }),
                          ...(rawElement.styles.borderRadius && { borderRadius: rawElement.styles.borderRadius }),
                          ...(rawElement.styles.borderStyle && { borderStyle: rawElement.styles.borderStyle }),
                          ...(rawElement.styles.borderWidth && { borderWidth: rawElement.styles.borderWidth }),
                          ...(rawElement.styles.color && { color: rawElement.styles.color }),
                          ...(rawElement.styles.display && { display: rawElement.styles.display }),
                          ...(rawElement.styles.float && { float: rawElement.styles.float }),
                          ...(rawElement.styles.fontSize && { fontSize: rawElement.styles.fontSize }),
                          ...(rawElement.styles.fontWeight && { fontWeight: rawElement.styles.fontWeight as FontWeight }),
                          ...(rawElement.styles.height && { height: rawElement.styles.height }),
                          ...(rawElement.styles.marginTop && { marginTop: rawElement.styles.marginTop }),
                          ...(rawElement.styles.marginLeft && { marginLeft: rawElement.styles.marginLeft }),
                          ...(rawElement.styles.marginRight && { marginRight: rawElement.styles.marginRight }),
                          ...(rawElement.styles.marginBottom && { marginBottom: rawElement.styles.marginBottom }),
                          ...(rawElement.styles.objectFit && { objectFit: rawElement.styles.objectFit }),
                          ...(rawElement.styles.paddingTop && { paddingTop: rawElement.styles.paddingTop }),
                          ...(rawElement.styles.paddingLeft && { paddingLeft: rawElement.styles.paddingLeft }),
                          ...(rawElement.styles.paddingRight && { paddingRight: rawElement.styles.paddingRight }),
                          ...(rawElement.styles.paddingBottom && { paddingBottom: rawElement.styles.paddingBottom }),
                          ...(rawElement.styles.textAlign && { textAlign: rawElement.styles.textAlign as TextAlign }),
                          ...(rawElement.styles.width && { width: rawElement.styles.width }),
                        },
                        createdAt: rawElement.createdAt,
                        updatedAt: rawElement.updatedAt,
                        deletedAt: rawElement.deletedAt
                      })
                    )
                  : []
              }
            })
          )
        })
      )
    }

    return website
  }

  async getNotificationByWebsiteId(websiteId: number): Promise<NotificationType[]> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/notifications/website/${websiteId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const json = await response.json()
      return json.data as NotificationType[] || []
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`)
      }
      throw new Error('Failed to fetch notifications: Unknown error')
    }
  }

  async getDashboardInfoByWebsiteId(websiteId: number): Promise<DashboardType>{
    const response = await fetch(`${import.meta.env.VITE_API}/website/dashboard/${websiteId}`)

    if (!response.ok) {
      throw new Error('')
    }

    const json = await response.json()
    return json.data as DashboardType
  }

  async getFormsByWebsiteId(websiteId: number): Promise<FormsType>{
    const response = await fetch(`${import.meta.env.VITE_API}/website/${websiteId}/forms`)

    if (!response.ok) {
      throw new Error('')
    }

    const json = await response.json()
    return json.data as FormsType
  }

  async getLeadsByWebsiteId(websiteId: number): Promise<LeadsType>{
    const response = await fetch(`${import.meta.env.VITE_API}/website/${websiteId}/leads`)

    if (!response.ok) {
      throw new Error('')
    }

    const json = await response.json()
    return json.data as LeadsType
  }

  async getUsersByWebsiteId(websiteId: number): Promise<Array<any>>{
    const response = await fetch(`${import.meta.env.VITE_API}/users/website/${websiteId}`)

    if (!response.ok) {
      throw new Error('')
    }

    const json = await response.json()
    return json.data as any[]
  }

  async getUserByEmail(websiteId: number, email: string): Promise<any | null>{
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/users/website/${websiteId}/email/${encodeURIComponent(email)}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const json = await response.json()
      return json.data
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error)
      return null
    }
  }

  async createUser(websiteId: number, userData: object): Promise<void>{
    const response = await fetch(`${import.meta.env.VITE_API}/users/website/${websiteId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  }

  async updateUser(websiteId: number, userData: object): Promise<void>{
    const response = await fetch(`${import.meta.env.VITE_API}/users/website/${websiteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  }

  async validateToken(token: string): Promise<ValidateTokenResponseType> {
    const response = await fetch(`${import.meta.env.VITE_API}/users/token/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    if (!response.ok) {
      return { isValid: false }
    }
    const responseJson = await response.json()
    return responseJson.data
  }

  async createPassword(userId: number, password: string): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API}/users/password/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        password
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  }
}

export { ApiService }
