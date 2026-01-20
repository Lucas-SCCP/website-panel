export interface UserType {
  id: number
  firstName: string
  lastName: string
  name: string
  email: string
  websiteId: number
  roleId: number
  accessLevelId: number
  defaultWebsiteId: number
  enabled: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  websiteId: number
  roleId?: number
  accessLevelId: number
  websiteDefault: number | null
  enabled?: boolean
}

export interface UpdateUserData {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  roleId?: number
  accessLevelId?: number
  websiteDefault?: number | null
  enabled?: boolean
}
