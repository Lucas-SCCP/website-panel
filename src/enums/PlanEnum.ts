export const PlanEnum = {
  Inicial: 1,
  Essencial: 2,
  Completo: 3,
  Profissional: 4,
  Gratuito: 5
} as const

export type PlanEnum = (typeof PlanEnum)[keyof typeof PlanEnum]
