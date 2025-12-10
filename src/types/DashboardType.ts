export type DashboardType = {
  plan: {
    websiteId: number
    id: number
    paymentTypeId: number
    endDate: string
    name: string
    price: string
    paymentType: string
  }
  [key: string]: unknown
}