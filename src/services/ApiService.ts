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

import { AuthenticateException } from '../exceptions/AuthenticateException'

class ApiService {
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
        throw new Error(`Erro ao buscar dados da API: ${error.message}`)
      } else {
        throw new Error('Erro desconhecido na API')
      }
    }
  }

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

      console.log('Websites retorno api:', json.data)

      const websites: WebsiteType[] = json.data.map((rawWebsite: RawWebsiteType) => this.parseWebsiteResponse(rawWebsite))

      console.log('Websites após parse:', websites)

      return websites
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar dados da API: ${error.message}`)
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
      domain_stage: rawWebsite.domain_stage,
      logo: rawWebsite.logo,
      properties: {
        header: rawWebsite.properties.header,
        footer: rawWebsite.properties.footer,
        social: rawWebsite.properties.social,
      },
      styles: {
        color: rawWebsite.styles.color,
        backgroundColor: rawWebsite.styles.backgroundColor,
      },
      enabled: rawWebsite.enabled,
      published_at: rawWebsite.published_at,
      created_at: rawWebsite.created_at,
      updated_at: rawWebsite.updated_at,
      deleted_at: rawWebsite.deleted_at,
      pages: rawWebsite.pages.map(
        (rawPage): PageType => ({
          id: rawPage.id,
          website_id: rawPage.website_id,
          title: rawPage.title,
          name: rawPage.name,
          path: rawPage.path,
          menu: rawPage.menu,
          menu_order: rawPage.menu_order,
          enabled: rawPage.enabled,
          components: rawPage.components.map(
            (rawComponent): ComponentType => ({
              id: rawComponent.id,
              page_id: rawComponent.page_id,
              component_type_id: rawComponent.component_type_id,
              properties: rawComponent.properties,
              name: rawComponent.name,
              size: rawComponent.size,
              sort: rawComponent.sort,
              enabled: rawComponent.enabled,
              created_at: rawComponent.created_at,
              updated_at: rawComponent.updated_at,
              deleted_at: rawComponent.deleted_at,
              elements: {
                line: rawComponent.elements?.line ?? 1,
                content: rawComponent.elements?.content
                  ? Object.values(rawComponent.elements.content).map(
                      (rawElement): ElementType => ({
                        id: rawElement.id,
                        component_parent: rawElement.component_parent,
                        component_id: rawElement.component_id,
                        element_type_id: rawElement.element_type_id,
                        size: rawElement.size,
                        sort: rawElement.sort,
                        properties: {
                          name: rawElement.properties.name,
                          title: rawElement.properties.title,
                          message: rawElement.properties.message,
                          type: rawElement.properties.type,
                          startHidden: rawElement.properties.startHidden,
                          
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
                        created_at: rawElement.created_at,
                        updated_at: rawElement.updated_at,
                        deleted_at: rawElement.deleted_at
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
}

export { ApiService }
