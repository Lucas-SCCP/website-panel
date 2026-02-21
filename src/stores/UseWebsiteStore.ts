import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WebsiteType, PageType, ComponentType, ElementType } from 'website-lib'

interface ChangeDetail {
  websiteId: number
  action?: 'updated' | 'added' | 'removed'
  changes?: {
    action: 'updated' | 'added' | 'removed'
    field: string
    oldValue: string
    newValue: string
  }[]
  page?: {
    id: number
    action?: 'updated' | 'added' | 'removed'
    changes?: {
      action: 'updated' | 'added' | 'removed'
      field: string
      oldValue: string
      newValue: string
    }[]
    component?: {
      id: number
      name: string
      action?: 'updated' | 'added' | 'removed'
      changes?: {
        action: 'updated' | 'added' | 'removed'
        field: string
        oldValue: string
        newValue: string
      }[]
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
  setSelectedWebsite: (website: WebsiteType | null) => void
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
        sessionStorage.removeItem('website-storage')
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
          selectedWebsiteId: website?.id || null,
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

        const oldValue = originalWebsite ? String(originalWebsite[key]) : String(currentSelectedWebsite[key])
        const newValue = String(value)

        const currentChanges = get().changes
        let updatedChanges: ChangeDetail

        if (oldValue === newValue) {
          // Se os valores são iguais, remover do objeto de changes
          if (currentChanges?.websiteId === currentSelectedWebsite.id) {
            updatedChanges = { ...currentChanges }
            
            if (updatedChanges.changes) {
              // Remover o field específico
              updatedChanges.changes = updatedChanges.changes.filter(ch => ch.field !== String(key))
              
              // Se não há mais changes, limpar changes
              if (updatedChanges.changes.length === 0) {
                updatedChanges = {
                  websiteId: currentSelectedWebsite.id,
                  changes: undefined
                }
              }
            }
            
            set({ 
              selectedWebsite: updatedWebsite,
              hasUnsavedChanges: false,
              changes: (updatedChanges.changes && updatedChanges.changes.length > 0) ? updatedChanges : null
            })
          } else {
            set({
              selectedWebsite: updatedWebsite,
              hasUnsavedChanges: false,
              changes: null
            })
          }
        } else {
          // Valores diferentes, criar/atualizar change
          if (currentChanges?.websiteId === currentSelectedWebsite.id) {
            // Se já existe um change para este website, vamos adicionar/atualizar o field
            updatedChanges = { ...currentChanges }
            
            if (!updatedChanges.changes) {
              updatedChanges.changes = []
            }
            
            const existingChangeIndex = updatedChanges.changes.findIndex(ch => ch.field === String(key))
            const newChange = {
              action: 'updated' as const,
              field: String(key),
              oldValue: oldValue,
              newValue: newValue
            }
            
            if (existingChangeIndex >= 0) {
              updatedChanges.changes[existingChangeIndex] = newChange
            } else {
              updatedChanges.changes.push(newChange)
            }
          } else {
            // Criar novo change
            updatedChanges = {
              websiteId: currentSelectedWebsite.id,
              action: 'updated',
              changes: [{
                action: 'updated',
                field: String(key),
                oldValue: oldValue,
                newValue: newValue
              }]
            }
          }
          
          set({
            selectedWebsite: updatedWebsite,
            hasUnsavedChanges: true,
            changes: updatedChanges
          })
        }
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

        // Tratamento especial para campos booleanos/numéricos
        const originalValue = originalPage ? originalPage[key] : currentSelectedPage[key]
        let oldValue: string
        let newValue: string
        
        if (key === 'enabled' || key === 'menu') {
          // Para campos booleanos/numéricos, normalizar para string boolean
          oldValue = String(!!originalValue)
          newValue = String(!!value)
        } else {
          oldValue = String(originalValue)
          newValue = String(value)
        }

        const currentChanges = get().changes
        let updatedChanges: ChangeDetail

        if (oldValue === newValue) {
          // Se os valores são iguais, remover do objeto de changes
          if (currentChanges?.websiteId === currentSelectedWebsite.id) {
            updatedChanges = { ...currentChanges }
            
            if (updatedChanges.page?.changes) {
              // Remover o field específico
              updatedChanges.page.changes = updatedChanges.page.changes.filter(ch => ch.field !== String(key))
              
              // Se não há mais changes para esta página, removê-la se não há componentes
              if (updatedChanges.page.changes.length === 0 && (!updatedChanges.page.component || updatedChanges.page.component.length === 0)) {
                updatedChanges = {
                  websiteId: currentSelectedWebsite.id,
                  page: undefined
                }
              }
            }
            
            set({ changes: updatedChanges.page ? updatedChanges : null })
          }
        } else {
          // Valores diferentes, criar/atualizar change
          if (currentChanges?.websiteId === currentSelectedWebsite.id) {
            // Se já existe um change para este website, vamos adicionar/atualizar a página
            updatedChanges = { ...currentChanges }
            
            if (!updatedChanges.page) {
              updatedChanges.page = {
                id: currentSelectedPage.id,
                action: 'updated',
                changes: []
              }
            }
            
            if (!updatedChanges.page.changes) {
              updatedChanges.page.changes = []
            }
            
            const existingChangeIndex = updatedChanges.page.changes.findIndex(ch => ch.field === String(key))
            const newChange = {
              action: 'updated' as const,
              field: String(key),
              oldValue: oldValue,
              newValue: newValue
            }
            
            if (existingChangeIndex >= 0) {
              updatedChanges.page.changes[existingChangeIndex] = newChange
            } else {
              updatedChanges.page.changes.push(newChange)
            }
          } else {
            // Criar novo change
            updatedChanges = {
              websiteId: currentSelectedWebsite.id,
              page: {
                id: currentSelectedPage.id,
                action: 'updated',
                changes: [{
                  action: 'updated',
                  field: String(key),
                  oldValue: oldValue,
                  newValue: newValue
                }]
              }
            }
          }
          
          set({ changes: updatedChanges })
        }
        
        set({ selectedPage: updatedPage })

        if (currentSelectedWebsite) {
          const updatedPages = currentSelectedWebsite.pages.map((page) =>
            page.id === currentSelectedPage.id ? updatedPage : page
          )
          const updatedWebsite = { ...currentSelectedWebsite, pages: updatedPages }
          
          // Verificar se há mudanças reais no objeto changes
          const finalChanges = get().changes
          const hasRealChanges = Boolean(finalChanges && (
            finalChanges.action || 
            (finalChanges.changes && finalChanges.changes.length > 0) ||
            (finalChanges.page && (
              (finalChanges.page.changes && finalChanges.page.changes.length > 0) ||
              (finalChanges.page.component && finalChanges.page.component.length > 0)
            ))
          ))
          
          set({ 
            selectedWebsite: updatedWebsite,
            hasUnsavedChanges: hasRealChanges
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

        // Tratamento especial para campos booleanos/numéricos
        const originalValue = originalComponent ? originalComponent[key] : currentSelectedPage.components.find(c => c.id === componentId)?.[key]
        let oldValue: string
        let newValue: string
        
        if (key === 'enabled') {
          // Para campos booleanos/numéricos, normalizar para string boolean
          oldValue = String(!!originalValue)
          newValue = String(!!value)
        } else {
          oldValue = String(originalValue)
          newValue = String(value)
        }

        const currentChanges = get().changes
        let updatedChanges: ChangeDetail

        if (oldValue === newValue) {
          // Se os valores são iguais, remover do objeto de changes
          if (currentChanges?.websiteId === currentSelectedWebsite.id) {
            updatedChanges = { ...currentChanges }
            
            if (updatedChanges.page?.component) {
              const targetComponent = updatedChanges.page.component.find(c => c.id === componentId)
              if (targetComponent?.changes) {
                // Remover o field específico
                targetComponent.changes = targetComponent.changes.filter(ch => ch.field !== String(key))
                
                // Se não há mais changes para este componente, removê-lo
                if (targetComponent.changes.length === 0) {
                  updatedChanges.page.component = updatedChanges.page.component.filter(c => c.id !== componentId)
                }
                
                // Se não há mais componentes para esta página, limpar changes
                if (updatedChanges.page.component.length === 0) {
                  updatedChanges = {
                    websiteId: currentSelectedWebsite.id,
                    page: undefined
                  }
                }
              }
              
              set({ changes: updatedChanges.page ? updatedChanges : null })
            }
          }
        } else {
          // Valores diferentes, criar/atualizar change
          const currentChanges = get().changes
          let updatedChanges: ChangeDetail

          if (currentChanges?.websiteId === currentSelectedWebsite.id) {
            // Se já existe um change para este website, vamos adicionar/atualizar o componente
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
                name: originalComponent ? String(originalComponent.name) : String(currentSelectedPage.components.find(c => c.id === componentId)?.name),
                action: 'updated',
                changes: [{
                  action: 'updated',
                  field: String(key),
                  oldValue: oldValue,
                  newValue: newValue
                }]
              }
              updatedChanges.page.component = updatedChanges.page.component || []
              updatedChanges.page.component.push(targetComponent)
            } else {
              // Atualizar componente existente - adicionar ou atualizar field
              if (!targetComponent.changes) {
                targetComponent.changes = []
              }
              
              const existingChangeIndex = targetComponent.changes.findIndex(ch => ch.field === String(key))
              const newChange = {
                action: 'updated' as const,
                field: String(key),
                oldValue: oldValue,
                newValue: newValue
              }
              
              if (existingChangeIndex >= 0) {
                targetComponent.changes[existingChangeIndex] = newChange
              } else {
                targetComponent.changes.push(newChange)
              }
            }
          } else {
            // Criar novo change
            updatedChanges = {
              websiteId: currentSelectedWebsite.id,
              page: {
                id: currentSelectedPage.id,
                component: [{
                  id: componentId,
                  name: originalComponent ? String(originalComponent.name) : String(currentSelectedPage.components.find(c => c.id === componentId)?.name),
                  action: 'updated',
                  changes: [{
                    action: 'updated',
                    field: String(key),
                    oldValue: oldValue,
                    newValue: newValue
                  }]
                }]
              }
            }
          }
          
          set({ changes: updatedChanges })
        }

        // Verificar se há mudanças reais no objeto changes
        const finalChanges = get().changes
        const hasRealChanges = Boolean(finalChanges && (
          finalChanges.action || 
          (finalChanges.changes && finalChanges.changes.length > 0) ||
          (finalChanges.page && (
            (finalChanges.page.changes && finalChanges.page.changes.length > 0) ||
            (finalChanges.page.component && finalChanges.page.component.length > 0)
          ))
        ))

        set({ 
          selectedPage: updatedPage,
          selectedWebsite: updatedWebsite,
          hasUnsavedChanges: hasRealChanges
        })
      },
      updateSelectedElementField: (componentId, elementId, key, value) => {
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

                if (key === 'properties' && typeof value === 'object' && value !== null) {
                  return {
                    ...element,
                    properties: {
                      ...element.properties,
                      ...value
                    }
                  }
                } else if (key === 'styles' && typeof value === 'object' && value !== null) {
                  return {
                    ...element,
                    styles: {
                      ...element.styles,
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

        if ((key === 'properties' || key === 'styles') && typeof value === 'object' && value !== null) {
          const currentElement = currentSelectedPage.components
            .find(c => c.id === componentId)?.elements.content
            ?.[elementIndex as number]
          
          if (currentElement && originalElement) {
            const valueObj = value as unknown as Record<string, unknown>
            Object.keys(valueObj).forEach(propKey => {
              const propOldValue = (key === 'properties') ? 
                originalElement.properties?.[propKey as keyof typeof originalElement.properties] : 
                originalElement.styles?.[propKey as keyof typeof originalElement.styles]
              const propNewValue = valueObj[propKey]
              
              const currentChanges = get().changes
              let updatedChanges: ChangeDetail
              
              // Normalizar os valores para comparação - converter ambos para string
              const normalizedOldValue = String(propOldValue)
              const normalizedNewValue = String(propNewValue)
              
              if (normalizedOldValue === normalizedNewValue) {
                // Se os valores são iguais, remover do objeto de changes
                if (currentChanges?.websiteId === currentSelectedWebsite.id) {
                  updatedChanges = { ...currentChanges }
                  
                  if (updatedChanges.page?.component) {
                    const targetComponent = updatedChanges.page.component.find(c => c.id === componentId)
                    if (targetComponent?.element) {
                      const existingElement = targetComponent.element.find(el => el.id === elementId)
                      if (existingElement) {
                        // Remover o change específico
                        existingElement.changes = existingElement.changes.filter(ch => ch.field !== propKey)
                        
                        // Se não há mais changes para este elemento, removê-lo
                        if (existingElement.changes.length === 0) {
                          targetComponent.element = targetComponent.element.filter(el => el.id !== elementId)
                        }
                        
                        // Se não há mais elementos para este componente, removê-lo
                        if (targetComponent.element.length === 0) {
                          updatedChanges.page.component = updatedChanges.page.component.filter(c => c.id !== componentId)
                        }
                        
                        // Se não há mais componentes para esta página, limpar changes
                        if (updatedChanges.page.component.length === 0) {
                          updatedChanges = {
                            websiteId: currentSelectedWebsite.id,
                            page: undefined
                          }
                        }
                        
                        set({ changes: updatedChanges.page ? updatedChanges : null })
                      }
                    }
                  }
                }
              } else {
                // Valores diferentes, adicionar/atualizar change
                if (currentChanges?.websiteId === currentSelectedWebsite.id) {
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
                    existingElement = { id: elementId, elementTypeId: originalElement?.elementTypeId ?? 0, changes: [] }
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
                          elementTypeId: originalElement?.elementTypeId ?? 0,
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
          
          if (String(oldValue) === String(newChangeValue)) {
            // Se os valores são iguais, remover do objeto de changes
            if (currentChanges?.websiteId === currentSelectedWebsite.id) {
              updatedChanges = { ...currentChanges }
              
              if (updatedChanges.page?.component) {
                const targetComponent = updatedChanges.page.component.find(c => c.id === componentId)
                if (targetComponent?.element) {
                  const existingElement = targetComponent.element.find(el => el.id === elementId)
                  if (existingElement) {
                    // Remover o change específico
                    existingElement.changes = existingElement.changes.filter(ch => ch.field !== fieldName)
                    
                    // Se não há mais changes para este elemento, removê-lo
                    if (existingElement.changes.length === 0) {
                      targetComponent.element = targetComponent.element.filter(el => el.id !== elementId)
                    }
                    
                    // Se não há mais elementos para este componente, removê-lo
                    if (targetComponent.element.length === 0) {
                      updatedChanges.page.component = updatedChanges.page.component.filter(c => c.id !== componentId)
                    }
                    
                    // Se não há mais componentes para esta página, limpar changes
                    if (updatedChanges.page.component.length === 0) {
                      updatedChanges = {
                        websiteId: currentSelectedWebsite.id,
                        page: undefined
                      }
                    }
                    
                    set({ changes: updatedChanges.page ? updatedChanges : null })
                  }
                }
              }
            }
          } else {
            // Valores diferentes, adicionar/atualizar change
            if (currentChanges?.websiteId === currentSelectedWebsite.id) {
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
                existingElement = { id: elementId, elementTypeId: originalElement?.elementTypeId ?? 0, changes: [] }
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
                      elementTypeId: originalElement?.elementTypeId ?? 0,
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
        }

        const isWebsiteDifferent = !allWebsites.some(website => website.id === updatedWebsite.id && JSON.stringify(website) === JSON.stringify(updatedWebsite))
        
        // Verificar se há mudanças reais no objeto changes
        const finalChanges = get().changes
        const hasRealChanges = Boolean(finalChanges && (
          finalChanges.action || 
          (finalChanges.changes && finalChanges.changes.length > 0) ||
          (finalChanges.page && (
            (finalChanges.page.changes && finalChanges.page.changes.length > 0) ||
            (finalChanges.page.component && finalChanges.page.component.length > 0)
          ))
        ))

        set({
          selectedPage: updatedPage,
          selectedWebsite: updatedWebsite,
          hasUnsavedChanges: isWebsiteDifferent && hasRealChanges
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
                const item = sessionStorage.getItem(name)
                return item ? JSON.parse(item) : null
              },
              setItem: (name, value) => {
                sessionStorage.setItem(name, JSON.stringify(value))
              },
              removeItem: (name) => {
                sessionStorage.removeItem(name)
              }
            }
          : undefined
    }
  )
)
