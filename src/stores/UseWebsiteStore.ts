import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WebsiteType, PageType, ComponentType, ElementType } from 'website-lib'

interface ChangeDetail {
  websiteId: number
  action?: 'updated' | 'added' | 'removed'
  field?: string
  oldValue?: string
  newValue?: string
  page?: {
    id: number
    action?: 'updated' | 'added' | 'removed'
    field?: string
    oldValue?: string
    newValue?: string
    component?: {
      id: number
      name: string
      action?: 'updated' | 'added' | 'removed'
      field?: string
      oldValue?: string
      newValue?: string
      element?: {
        id: number
        elementTypeId: number
        changes: {
          action: 'updated' | 'added' | 'removed'
          field: string
          oldValue: string
          newValue: string
        }[]
      }[]
    }[]
  }
}

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
  
  changes: ChangeDetail | null
  getChanges: () => ChangeDetail | null
  clearChanges: () => void

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
          selectedWebsite: websiteCopy,
          changes: null,
          hasUnsavedChanges: false
        })
      },
      updateSelectedWebsiteField: (key, value) => {
        const allWebsites = get().allWebsites
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedWebsite) return

        const originalWebsite = allWebsites.find(w => w.id === currentSelectedWebsite.id)
        const updatedWebsite = { ...currentSelectedWebsite, [key]: value }

        const newChange: ChangeDetail = {
          websiteId: currentSelectedWebsite.id,
          action: 'updated',
          field: String(key),
          oldValue: originalWebsite ? String(originalWebsite[key]) : String(currentSelectedWebsite[key]),
          newValue: String(value),
        }
        
        set({
          selectedWebsite: updatedWebsite,
          hasUnsavedChanges: true,
          changes: newChange
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
        const allWebsites = get().allWebsites
        const currentSelectedPage = get().selectedPage
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedPage || !currentSelectedWebsite) return

        const originalWebsite = allWebsites.find(w => w.id === currentSelectedWebsite.id)
        const originalPage = originalWebsite?.pages.find(p => p.id === currentSelectedPage.id)
        
        const updatedPage = { ...currentSelectedPage, [key]: value }

        const newChange: ChangeDetail = {
          websiteId: currentSelectedWebsite.id,
          page: {
            id: currentSelectedPage.id,
            action: 'updated',
            field: String(key),
            oldValue: originalPage ? String(originalPage[key]) : String(currentSelectedPage[key]),
            newValue: String(value)
          }
        }
        
        set({ selectedPage: updatedPage })

        if (currentSelectedWebsite) {
          const updatedPages = currentSelectedWebsite.pages.map((page) =>
            page.id === currentSelectedPage.id ? updatedPage : page
          )
          const updatedWebsite = { ...currentSelectedWebsite, pages: updatedPages }
          set({ 
            selectedWebsite: updatedWebsite,
            hasUnsavedChanges: true,
            changes: newChange
          })
        }
      },
      updateSelectedComponentField: (componentId, key, value) => {
        const allWebsites = get().allWebsites
        const currentSelectedPage = get().selectedPage
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedPage || !currentSelectedWebsite) return

        const originalWebsite = allWebsites.find(w => w.id === currentSelectedWebsite.id)
        const originalPage = originalWebsite?.pages.find(p => p.id === currentSelectedPage.id)
        const originalComponent = originalPage?.components.find(c => c.id === componentId)

        const updatedComponents = currentSelectedPage.components.map((component) =>
          component.id === componentId ? { ...component, [key]: value } : component
        )

        const updatedPage = { ...currentSelectedPage, components: updatedComponents }
        const updatedPages = currentSelectedWebsite.pages.map((page) =>
          page.id === currentSelectedPage.id ? updatedPage : page
        )
        const updatedWebsite = { ...currentSelectedWebsite, pages: updatedPages }

        const newChange: ChangeDetail = {
          websiteId: currentSelectedWebsite.id,
          page: {
            id: currentSelectedPage.id,
            component: [{
              id: componentId,
              name: originalComponent ? String(originalComponent.name) : String(currentSelectedPage.components.find(c => c.id === componentId)?.name),
              action: 'updated',
              field: String(key),
              oldValue: originalComponent ? String(originalComponent[key]) : String(currentSelectedPage.components.find(c => c.id === componentId)?.[key]),
              newValue: String(value)
            }]
          }
        }

        set({ 
          selectedPage: updatedPage,
          selectedWebsite: updatedWebsite,
          hasUnsavedChanges: true,
          changes: newChange
        })
      },
      updateSelectedElementField: (componentId, elementId, key, value) => {
        console.log('updateSelectedElementField')
        const allWebsites = get().allWebsites
        const currentSelectedPage = get().selectedPage
        const currentSelectedWebsite = get().selectedWebsite
        if (!currentSelectedPage || !currentSelectedWebsite) return

        const originalWebsiteForElement = allWebsites.find(w => w.id === currentSelectedWebsite.id)
        const originalPageForElement = originalWebsiteForElement?.pages.find(p => p.id === currentSelectedPage.id)
        const originalComponentForElement = originalPageForElement?.components.find(c => c.id === componentId)
        const originalElement = Array.isArray(originalComponentForElement?.elements.content) 
          ? originalComponentForElement.elements.content.find((el: ElementType) => el.id === elementId)
          : null

        const elementIndex = Array.isArray(currentSelectedPage.components.find(c => c.id === componentId)?.elements.content)
          ? (currentSelectedPage.components.find(c => c.id === componentId)?.elements.content as ElementType[]).findIndex(el => el.id === elementId)
          : -1

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

        const oldValue = originalElement ? originalElement[key as keyof typeof originalElement] : undefined
        const newChangeValue = value
        const fieldName = String(key)

        if (key === "properties" && typeof value === "object" && value !== null) {
          const currentElement = currentSelectedPage.components
            .find(c => c.id === componentId)?.elements.content
            ?.[elementIndex as number]
          
          if (currentElement && originalElement) {
            const valueObj = value as unknown as Record<string, unknown>
            Object.keys(valueObj).forEach(propKey => {
              const propOldValue = originalElement.properties?.[propKey as keyof typeof originalElement.properties]
              const propNewValue = valueObj[propKey]
              
              if (JSON.stringify(propOldValue) !== JSON.stringify(propNewValue)) {
                const currentChanges = get().changes
                let updatedChanges: ChangeDetail
                
                if (currentChanges && currentChanges.websiteId === currentSelectedWebsite.id) {
                  // Se já existe um change para este website, vamos adicionar/atualizar o elemento
                  updatedChanges = { ...currentChanges }
                  
                  if (!updatedChanges.page) {
                    updatedChanges.page = {
                      id: currentSelectedPage.id,
                      component: []
                    }
                  }
                  
                  let targetComponent = updatedChanges.page.component?.find(c => c.id === componentId)
                  if (!targetComponent) {
                    targetComponent = { 
                      id: componentId, 
                      name: originalComponentForElement ? String(originalComponentForElement.name) : '', 
                      element: [] 
                    }
                    updatedChanges.page.component = updatedChanges.page.component || []
                    updatedChanges.page.component.push(targetComponent)
                  }
                  
                  let existingElement = targetComponent.element?.find(el => el.id === elementId)
                  if (!existingElement) {
                    existingElement = { id: elementId, elementTypeId: originalElement?.element_type_id ?? 0, changes: [] }
                    targetComponent.element = targetComponent.element || []
                    targetComponent.element.push(existingElement)
                  }
                  
                  // Verificar se já existe um change para este campo
                  const existingChangeIndex = existingElement.changes.findIndex(ch => ch.field === propKey)
                  const newChange = {
                    action: 'updated' as const,
                    field: propKey,
                    oldValue: String(propOldValue),
                    newValue: String(propNewValue)
                  }
                  
                  if (existingChangeIndex >= 0) {
                    existingElement.changes[existingChangeIndex] = newChange
                  } else {
                    existingElement.changes.push(newChange)
                  }
                } else {
                  // Criar novo change
                  updatedChanges = {
                    websiteId: currentSelectedWebsite.id,
                    page: {
                      id: currentSelectedPage.id,
                      component: [{
                        id: componentId,
                        name: originalComponentForElement ? String(originalComponentForElement.name) : '',
                        element: [{
                          id: elementId,
                          elementTypeId: originalElement?.element_type_id ?? 0,
                          changes: [{
                            action: 'updated',
                            field: propKey,
                            oldValue: String(propOldValue),
                            newValue: String(propNewValue)
                          }]
                        }]
                      }]
                    }
                  }
                }
                
                set({ changes: updatedChanges })
              }
            })
          }
        } else {
          const currentChanges = get().changes
          let updatedChanges: ChangeDetail
          
          if (currentChanges && currentChanges.websiteId === currentSelectedWebsite.id) {
            // Se já existe um change para este website, vamos adicionar/atualizar o elemento
            updatedChanges = { ...currentChanges }
            
            if (!updatedChanges.page) {
              updatedChanges.page = {
                id: currentSelectedPage.id,
                component: []
              }
            }
            
            let targetComponent = updatedChanges.page.component?.find(c => c.id === componentId)
            if (!targetComponent) {
              targetComponent = { 
                id: componentId, 
                name: originalComponentForElement ? String(originalComponentForElement.name) : '', 
                element: [] 
              }
              updatedChanges.page.component = updatedChanges.page.component || []
              updatedChanges.page.component.push(targetComponent)
            }
            
            let existingElement = targetComponent.element?.find(el => el.id === elementId)
            if (!existingElement) {
              existingElement = { id: elementId, elementTypeId: originalElement?.element_type_id ?? 0, changes: [] }
              targetComponent.element = targetComponent.element || []
              targetComponent.element.push(existingElement)
            }
            
            // Verificar se já existe um change para este campo
            const existingChangeIndex = existingElement.changes.findIndex(ch => ch.field === fieldName)
            const newChange = {
              action: 'updated' as const,
              field: fieldName,
              oldValue: String(oldValue),
              newValue: String(newChangeValue)
            }
            
            if (existingChangeIndex >= 0) {
              existingElement.changes[existingChangeIndex] = newChange
            } else {
              existingElement.changes.push(newChange)
            }
          } else {
            // Criar novo change
            updatedChanges = {
              websiteId: currentSelectedWebsite.id,
              page: {
                id: currentSelectedPage.id,
                component: [{
                  id: componentId,
                  name: originalComponentForElement ? String(originalComponentForElement.name) : '',
                  element: [{
                    id: elementId,
                    elementTypeId: originalElement?.element_type_id ?? 0,
                    changes: [{
                      action: 'updated',
                      field: fieldName,
                      oldValue: String(oldValue),
                      newValue: String(newChangeValue)
                    }]
                  }]
                }]
              }
            }
          }
          
          set({ changes: updatedChanges })
        }

        const isWebsiteDifferent = !allWebsites.some(website => website.id === updatedWebsite.id && JSON.stringify(website) === JSON.stringify(updatedWebsite))

        set({
          selectedPage: updatedPage,
          selectedWebsite: updatedWebsite,
          hasUnsavedChanges: isWebsiteDifferent
        })
      },

      hasUnsavedChanges: false,

      changes: null,
      getChanges: () => {
        return get().changes
      },
      clearChanges: () => {
        set({ changes: null })
      },
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
