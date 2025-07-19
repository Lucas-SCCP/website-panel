import type { RawWebsite } from '../types/RawWebsite';
import type { Website, Page, Component, Element } from '../types/Website';
import { AuthenticateException } from '../exceptions/AuthenticateException'
import type { AuthenticateResponse } from '../types/AuthenticateResponse';

class ApiService {
  async authenticate(email: string, password: string): Promise<AuthenticateResponse> {
    const data = {
      email: email,
      password: password
    }
    const response = await fetch(
      `${import.meta.env.VITE_API}/users/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );

    const responseJson = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticateException(responseJson.message)
      }
      
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return responseJson;
  }

  async getStructure(id: string | number): Promise<Website> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/website/${id}/structure`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();

      return this.parseWebsiteResponse(json.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar dados da API: ${error.message}`);
      } else {
        throw new Error('Erro desconhecido na API');
      }
    }
  }

  async getAllWebsiteByUserId(userId: number, userToken: string): Promise<Website[]> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/website/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();

      const websites: Website[] = json.data.map((item: Website) => this.parseWebsiteResponse(item));

      return websites;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar dados da API: ${error.message}`);
      } else {
        throw new Error('Erro desconhecido na API');
      }
    }
  }

  parseWebsiteResponse(raw: RawWebsite): Website {
    const pages: Page[] = raw.pages.map((page): Page => ({
      ...page,
      components: page.components.map((component): Component => {
        const parsedContent: Element[] = Object.values(component.elements?.content || {}).map((el: any) => ({
                  ...el,
          size: Number(el.size),
          properties: typeof el.properties === 'string'
            ? JSON.parse(el.properties)
            : el.properties,
          content: el.content ?? '',
        }));

        return {
          ...component,
          size: Number(component.size),
          properties: typeof component.properties === 'string'
            ? JSON.parse(component.properties)
            : component.properties,
          elements: {
            line: component.elements?.line ?? 1,
            content: parsedContent,
          }
        };
      }),
    }));

    return {
      ...raw,
      pages,
    };
  }
}

const apiService = new ApiService();
export default apiService;
