import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Website, Page, Component, Element } from '../types/Website'

interface WebsiteStore {
  data: Website[]
  selectedWebsite: Website | null
  selectedPage: Page | null
  setWebsiteData: (data: Website[]) => void
  clearWebsiteData: () => void
  addWebsite: (website: Website) => void
  setSelectedWebsite: (website: Website | null) => void
  setSelectedPage: (page: Page | null) => void
  updateWebsiteField: <K extends keyof Website>(website_id: number, key: K, value: Website[K]) => void
  updatePageField: <K extends keyof Page>(website_id: number, page_id: number, key: K, value: Page[K]) => void
  updateComponentField: <K extends keyof Component>(website_id: number, page_id: number, component_id: number, key: K, value: Component[K]) => void
  updateElementField: <K extends keyof Element>(website_id: number, page_id: number, component_id: number, element_id: number, key: K, value: Element[K]) => void
  getWebsiteById: (website_id: number) => Website | undefined
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

              const updatedContent = Object.fromEntries(
                Object.entries(component.elements.content).map(([id, element]) => [
                  id,
                  element.id === elementId ? { ...element, [key]: value } : element,
                ])
              )

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