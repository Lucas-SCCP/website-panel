import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { WebsiteType, PageType, ComponentType, ElementType } from 'website-lib'

interface WebsiteStore {
  data: WebsiteType[]
  selectedWebsite: WebsiteType | null
  selectedPage: PageType | null
  setWebsiteData: (data: WebsiteType[]) => void
  clearWebsiteData: () => void
  addWebsite: (website: WebsiteType) => void
  setSelectedWebsite: (website: WebsiteType | null) => void
  setSelectedPage: (page: PageType | null) => void
  updateWebsiteField: <K extends keyof WebsiteType>(website_id: number, key: K, value: WebsiteType[K]) => void
  updatePageField: <K extends keyof PageType>(website_id: number, page_id: number, key: K, value: PageType[K]) => void
  updateComponentField: <K extends keyof ComponentType>(website_id: number, page_id: number, component_id: number, key: K, value: ComponentType[K]) => void
  updateElementField: <K extends keyof ElementType>(website_id: number, page_id: number, component_id: number, element_id: number, key: K, value: ElementType[K]) => void
  getWebsiteById: (website_id: number) => WebsiteType | undefined
}

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set, get) => ({
      data: [],
      selectedWebsite: null,
      selectedPage: null,
      
      setWebsiteData: (data) => set({ data }),
      clearWebsiteData: () => set({ data: [] }),
      addWebsite: (website) => { set(state => ({data: [...state.data, website]}))},
      setSelectedWebsite: (website) => set({ selectedWebsite: website }),
      setSelectedPage: (page) => set({ selectedPage: page}),
      
      updateWebsiteField: (websiteId, key, value) => {
        const currentData = get().data.map(website =>
          website.id === websiteId ? { ...website, [key]: value } : website
        )
        set({
          data: currentData
        })
      },

      updatePageField: (websiteId, pageId, key, value) => {
        const updatedData = get().data.map(website => {
          if (website.id !== websiteId) return website;

          const updatedPages = website.pages.map(page =>
            page.id === pageId ? { ...page, [key]: value } : page
          )

          return { ...website, pages: updatedPages }
        })

        set({ data: updatedData })
      },

      updateComponentField: (websiteId, pageId, componentId, key, value) => {
        const updatedData = get().data.map(website => {
          if (website.id !== websiteId) return website;

          const updatedPages = website.pages.map(page => {
            if (page.id !== pageId) return page;

            const updatedComponents = page.components.map(component =>
              component.id === componentId ? { ...component, [key]: value } : component
            )

            return { ...page, components: updatedComponents }
          })

          return { ...website, pages: updatedPages }
        })

        set({ data: updatedData })
      },

      updateElementField: (websiteId, pageId, componentId, elementId, key, value) => {
        const updatedData = get().data.map(website => {
          if (website.id !== websiteId) return website;

          const updatedPages = website.pages.map(page => {
            if (page.id !== pageId) return page;

            const updatedComponents = page.components.map(component => {
              if (component.id !== componentId) return component;

              const updatedContent = Array.isArray(component.elements.content)
                ? component.elements.content.map(element =>
                    element.id === elementId ? { ...element, [key]: value } : element
                  )
                : component.elements.content

              return {
                ...component,
                elements: {
                  ...component.elements,
                  content: updatedContent,
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
        return get().data.find(website => website.id === websiteId)
      }
    }),
    {
      name: 'website-storage',
      storage: typeof window !== 'undefined'
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
        : undefined,
    }
  )
)