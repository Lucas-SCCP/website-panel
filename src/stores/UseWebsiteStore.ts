import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WebsiteType, PageType, ComponentType, ElementType } from 'website-lib'

interface WebsiteStore {
  allWebsites: WebsiteType[]
  setAllWebsites: (data: WebsiteType[]) => void
  getAllWebsites: (data: WebsiteType[]) => WebsiteType[]
  clearAllWebsites: () => void

  selectedWebsiteId: number | null
  setSelectedWebsiteId: (id: number | null) => void
  getSelectedWebsiteId: () => number | null
  clearSelectedWebsiteId: () => void

  selectedPageId: number | null
  setSelectedPageId: (id: number | null) => void
  getSelectedPageId: () => number | null
  clearSelectedPageId: () => void

  selectedWebsite: WebsiteType | null
  setSelectedWebsite: (website: WebsiteType) => void
  updateSelectedWebsiteField: <K extends keyof WebsiteType>(key: K, value: WebsiteType[K]) => void

  selectedPage: PageType | null
  setSelectedPage: (page: PageType | null) => void
  updateSelectedPageField: <K extends keyof PageType>(key: K, value: PageType[K]) => void
  
  updateSelectedComponentField: <K extends keyof ComponentType>(component_id: number, key: K, value: ComponentType[K]) => void
  updateSelectedElementField: <K extends keyof ElementType>(component_id: number, element_id: number, key: K, value: ElementType[K]) => void
  
  hasUnsavedChanges: boolean
}

export const UseWebsiteStore = create<WebsiteStore>()(
  persist(
    (set, get) => ({
      allWebsites: [],
      setAllWebsites: (allWebsites) => set({ allWebsites }),
      getAllWebsites: () => {
        return get().allWebsites
      },
      clearAllWebsites: () => {
        set({ allWebsites: [] })
        localStorage.removeItem('website-storage')
      },
      
      selectedWebsiteId: null,
      setSelectedWebsiteId: (id: number | null) => {
        set({ selectedWebsiteId: id })
      },
      getSelectedWebsiteId: () => {
        return get().selectedWebsiteId
      },
      clearSelectedWebsiteId: () => {
        set({ selectedWebsiteId: null })
      },

      selectedPageId: null,
      setSelectedPageId: (id: number | null) => {
        set({ selectedPageId: id })
      },
      getSelectedPageId: () => {
        return get().selectedPageId
      },
      clearSelectedPageId: () => {
        set({ selectedPageId: null })
      },

      selectedWebsite: null,
      setSelectedWebsite: (website) => {
        const websiteCopy = JSON.parse(JSON.stringify(website))
        set({ 
          selectedWebsiteId: website.id,
          selectedWebsite: websiteCopy
        })
      },
      updateSelectedWebsiteField: (key, value) => {
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedWebsite) return

        const updatedWebsite = { ...currentSelectedWebsite, [key]: value }
        set({ 
          selectedWebsite: updatedWebsite,
          hasUnsavedChanges: true
        })
      },

      selectedPage: null,
      setSelectedPage: (page) => {
        const pageCopy = page ? JSON.parse(JSON.stringify(page)) : null
        set({ 
          selectedPageId: page?.id || null,
          selectedPage: pageCopy 
        })
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
          set({ 
            selectedWebsite: updatedWebsite,
            hasUnsavedChanges: true
          })
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
          selectedWebsite: updatedWebsite,
          hasUnsavedChanges: true
        })
      },
      updateSelectedElementField: (componentId, elementId, key, value) => {
        console.log('updateSelectedElementField')
        const allWebsites = get().allWebsites
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

        const isWebsiteDifferent = !allWebsites.some(website => website.id === updatedWebsite.id && JSON.stringify(website) === JSON.stringify(updatedWebsite))

        set({
          selectedPage: updatedPage,
          selectedWebsite: updatedWebsite,
          hasUnsavedChanges: isWebsiteDifferent
        })
      },

      hasUnsavedChanges: false,
    }),
    {
      name: 'website-storage',
      partialize: (state) => ({ 
        allWebsites: state.allWebsites,
        selectedWebsiteId: state.selectedWebsiteId,
        selectedPageId: state.selectedPageId
      }),
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
