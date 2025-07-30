import type {
  RawWebsiteType,
  WebsiteType,
  PageType,
  ComponentType,
  ElementType,
  AuthenticateResponseType
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

      const websites: WebsiteType[] = json.data.map((rawWebsite: RawWebsiteType) => this.parseWebsiteResponse(rawWebsite))

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
          // Adicione aqui o token de autenticação se necessário
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
                          ...(rawElement.properties.validateTypeId && { validateTypeId: rawElement.properties.validateTypeId }),

                          ...(rawElement.properties.hideOnClick && { hideOnClick: rawElement.properties.hideOnClick }),
                          ...(rawElement.properties.actionId && { action: rawElement.properties.actionId }),
                          ...(rawElement.properties.successActionId && { successActionId: rawElement.properties.successActionId }),
                          ...(rawElement.properties.errorActionId && { errorActionId: rawElement.properties.errorActionId }),
                          ...(rawElement.properties.successMessageId && { successMessageId: rawElement.properties.successMessageId }),
                          ...(rawElement.properties.errorMessageId && { errorMessageId: rawElement.properties.errorMessageId }),
                        },
                        styles: {
                          color: rawElement.styles.color,
                          fontSize: rawElement.styles.fontSize,
                          textAlign: rawElement.styles.textAlign,
                          fontWeight: rawElement.styles.fontWeight,
                          display: rawElement.styles.display,
                          height: rawElement.styles.height,
                          alignItems: rawElement.styles.alignItems,
                          marginTop: rawElement.styles.marginTop,
                          marginLeft: rawElement.styles?.marginLeft
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
