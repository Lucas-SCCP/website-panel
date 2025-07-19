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

      const websites: WebsiteType[] = json.data.map((item: RawWebsiteType) => this.parseWebsiteResponse(item))

      return websites
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar dados da API: ${error.message}`)
      } else {
        throw new Error('Erro desconhecido na API')
      }
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
                        component_id: rawElement.component_id,
                        element_type_id: rawElement.element_type_id,
                        properties: {
                          title: rawElement.properties.title,
                          name: rawElement.properties.name,
                          text: rawElement.properties.text,
                          placeholder: rawElement.properties.placeholder,
                          type: rawElement.properties.type,
                          validateType: rawElement.properties.validateType,
                          loadingMessage: rawElement.properties.loadingMessage,
                          action: rawElement.properties.action,
                          successMessageId: rawElement.properties.successMessageId,
                          successActionId: rawElement.properties.successActionId,
                          href: rawElement.properties.href,
                          message: rawElement.properties.message,
                          variant: rawElement.properties.variant,
                          visibilityAfter: rawElement.properties.visibilityAfter,
                          hideButtonAfter: rawElement.properties.hideButtonAfter,
                          loadingTime: rawElement.properties.loadingTime,
                          mask: rawElement.properties.mask,
                          required: rawElement.properties.required,
                          style: {
                            color: rawElement.properties.style?.color,
                            fontSize: rawElement.properties.style?.fontSize,
                            textAlign: rawElement.properties.style?.textAlign,
                            fontWeight: rawElement.properties.style?.fontWeight,
                            display: rawElement.properties.style?.display,
                            height: rawElement.properties.style?.height,
                            alignItems: rawElement.properties.style?.alignItems,
                            marginTop: rawElement.properties.style?.marginTop,
                            marginLeft: rawElement.properties.style?.marginLeft
                          }
                        },
                        size: rawElement.size,
                        component_parent: rawElement.component_parent,
                        sort: rawElement.sort,
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
