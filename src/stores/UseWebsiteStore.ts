import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { WebsiteType, PageType, ComponentType, ElementType } from 'website-lib'

interface WebsiteStore {
  data: WebsiteType[]
  selectedWebsite: WebsiteType | null
  selectedPage: PageType | null
  setWebsiteData: (data: WebsiteType[]) => void
  getWebsiteData: (data: WebsiteType[]) => WebsiteType[]
  clearWebsiteData: () => void
  addWebsite: (website: WebsiteType) => void
  setSelectedWebsite: (website: WebsiteType) => void
  setSelectedPage: (page: PageType | null) => void
  updateWebsiteField: <K extends keyof WebsiteType>(website_id: number, key: K, value: WebsiteType[K]) => void
  updatePageField: <K extends keyof PageType>(website_id: number, page_id: number, key: K, value: PageType[K]) => void
  updateComponentField: <K extends keyof ComponentType>(
    website_id: number,
    page_id: number,
    component_id: number,
    key: K,
    value: ComponentType[K]
  ) => void
  updateElementField: <K extends keyof ElementType>(
    website_id: number,
    page_id: number,
    component_id: number,
    element_id: number,
    key: K,
    value: ElementType[K]
  ) => void
  // Novos métodos para atualizar apenas os dados selecionados (sem afetar 'data')
  updateSelectedWebsiteField: <K extends keyof WebsiteType>(key: K, value: WebsiteType[K]) => void
  updateSelectedPageField: <K extends keyof PageType>(key: K, value: PageType[K]) => void
  updateSelectedComponentField: <K extends keyof ComponentType>(
    component_id: number,
    key: K,
    value: ComponentType[K]
  ) => void
  updateSelectedElementField: <K extends keyof ElementType>(
    component_id: number,
    element_id: number,
    key: K,
    value: ElementType[K]
  ) => void
  // Método para salvar as alterações do selectedWebsite de volta para data
  saveSelectedWebsiteChanges: () => void
  getWebsiteById: (website_id: number) => WebsiteType | undefined
}

export const UseWebsiteStore = create<WebsiteStore>()(
  persist(
    (set, get) => ({
      data: [],
      selectedWebsite: null,
      selectedPage: null,

      setWebsiteData: (data) => set({ data }),
      clearWebsiteData: () => set({ data: [] }),
      addWebsite: (website) => {
        set((state) => ({ data: [...state.data, website] }))
      },
      setSelectedWebsite: (website) => {
        // Criar uma cópia profunda do website para evitar mutação dos dados originais
        const websiteCopy = website ? JSON.parse(JSON.stringify(website)) : null
        set({ selectedWebsite: websiteCopy })
      },
      setSelectedPage: (page) => {
        // Criar uma cópia profunda da página para evitar mutação dos dados originais
        const pageCopy = page ? JSON.parse(JSON.stringify(page)) : null
        set({ selectedPage: pageCopy })
      },

      updateWebsiteField: (websiteId, key, value) => {
        const currentData = get().data.map((website) =>
          website.id === websiteId ? { ...website, [key]: value } : website
        )
        set({
          data: currentData
        })
      },

      updatePageField: (websiteId, pageId, key, value) => {
        const updatedData = get().data.map((website) => {
          if (website.id !== websiteId) return website

          const updatedPages = website.pages.map((page) => (page.id === pageId ? { ...page, [key]: value } : page))

          return { ...website, pages: updatedPages }
        })

        set({ data: updatedData })
      },

      updateComponentField: (websiteId, pageId, componentId, key, value) => {
        const updatedData = get().data.map((website) => {
          if (website.id !== websiteId) return website

          const updatedPages = website.pages.map((page) => {
            if (page.id !== pageId) return page

            const updatedComponents = page.components.map((component) =>
              component.id === componentId ? { ...component, [key]: value } : component
            )

            return { ...page, components: updatedComponents }
          })

          return { ...website, pages: updatedPages }
        })

        set({ data: updatedData })
      },

      updateElementField: (websiteId, pageId, componentId, elementId, key, value) => {
        const updatedData = get().data.map((website) => {
          if (website.id !== websiteId) return website

          const updatedPages = website.pages.map((page) => {
            if (page.id !== pageId) return page

            const updatedComponents = page.components.map((component) => {
              if (component.id !== componentId) return component

              const updatedContent = Array.isArray(component.elements.content)
                ? component.elements.content.map((element) => {
                  if (element.id !== elementId) return element

                  if (key === "properties" && typeof value === "object" && value !== null) {
                    return {
                      ...element,
                      properties: {
                        ...element.properties,
                        ...value
                      }
                    }
                  }

                  return { ...element, [key]: value }
                })
              : component.elements.content

              return {
                ...component,
                elements: {
                  ...component.elements,
                  content: updatedContent
                }
              }
            })

            return { ...page, components: updatedComponents }
          })

          return { ...website, pages: updatedPages }
        })

        set({ data: updatedData })
      },

      getWebsiteById: (websiteId) => {
        return get().data.find((website) => website.id === websiteId)
      },

      getWebsiteData: () => {
        return get().data
      },

      // Novos métodos para atualizar apenas os dados selecionados
      updateSelectedWebsiteField: (key, value) => {
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedWebsite) return

        const updatedWebsite = { ...currentSelectedWebsite, [key]: value }
        set({ selectedWebsite: updatedWebsite })
      },

      updateSelectedPageField: (key, value) => {
        const currentSelectedPage = get().selectedPage
        if (!currentSelectedPage) return

        const updatedPage = { ...currentSelectedPage, [key]: value }
        set({ selectedPage: updatedPage })

        // Também atualizar a página dentro do selectedWebsite
        const currentSelectedWebsite = get().selectedWebsite
        if (currentSelectedWebsite) {
          const updatedPages = currentSelectedWebsite.pages.map((page) =>
            page.id === currentSelectedPage.id ? updatedPage : page
          )
          const updatedWebsite = { ...currentSelectedWebsite, pages: updatedPages }
          set({ selectedWebsite: updatedWebsite })
        }
      },

      updateSelectedComponentField: (componentId, key, value) => {
        const currentSelectedPage = get().selectedPage
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedPage || !currentSelectedWebsite) return

        const updatedComponents = currentSelectedPage.components.map((component) =>
          component.id === componentId ? { ...component, [key]: value } : component
        )

        const updatedPage = { ...currentSelectedPage, components: updatedComponents }
        const updatedPages = currentSelectedWebsite.pages.map((page) =>
          page.id === currentSelectedPage.id ? updatedPage : page
        )
        const updatedWebsite = { ...currentSelectedWebsite, pages: updatedPages }

        set({ 
          selectedPage: updatedPage,
          selectedWebsite: updatedWebsite
        })
      },

      updateSelectedElementField: (componentId, elementId, key, value) => {
        const currentSelectedPage = get().selectedPage
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedPage || !currentSelectedWebsite) return

        const updatedComponents = currentSelectedPage.components.map((component) => {
          if (component.id !== componentId) return component

          const updatedContent = Array.isArray(component.elements.content)
            ? component.elements.content.map((element) => {
                if (element.id !== elementId) return element

                if (key === "properties" && typeof value === "object" && value !== null) {
                  return {
                    ...element,
                    properties: {
                      ...element.properties,
                      ...value
                    }
                  }
                }

                return { ...element, [key]: value }
              })
            : component.elements.content

          return {
            ...component,
            elements: {
              ...component.elements,
              content: updatedContent
            }
          }
        })

        const updatedPage = { ...currentSelectedPage, components: updatedComponents }
        const updatedPages = currentSelectedWebsite.pages.map((page) =>
          page.id === currentSelectedPage.id ? updatedPage : page
        )
        const updatedWebsite = { ...currentSelectedWebsite, pages: updatedPages }

        set({ 
          selectedPage: updatedPage,
          selectedWebsite: updatedWebsite
        })
      },

      saveSelectedWebsiteChanges: () => {
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedWebsite) return

        const updatedData = get().data.map((website) =>
          website.id === currentSelectedWebsite.id ? currentSelectedWebsite : website
        )

        set({ data: updatedData })
      }
    }),
    {
      name: 'website-storage',
      storage:
        typeof window !== 'undefined'
          ? {
              getItem: (name) => {
                const item = localStorage.getItem(name)
                return item ? JSON.parse(item) : null
              },
              setItem: (name, value) => {
                localStorage.setItem(name, JSON.stringify(value))
              },
              removeItem: (name) => {
                localStorage.removeItem(name)
              }
            }
          : undefined
    }
  )
)
