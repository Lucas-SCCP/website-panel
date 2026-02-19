export const AccessLevelEnum = {
  Administrador: 1,
  Editor: 2,
  Visualizador: 3,
  SuperUsuario: 99
} as const

export type AccessLevelEnum = (typeof AccessLevelEnum)[keyof typeof AccessLevelEnum]
