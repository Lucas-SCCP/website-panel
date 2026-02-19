import { PlanEnum } from "../enums/PlanEnum";

class PlanService {

  getLimitUsersByPlan(planId: number): number {
    switch (planId) {
      case PlanEnum.Inicial:
        return 1;
      case PlanEnum.Essencial:
        return 3;
      case PlanEnum.Completo:
        return 5;
      case PlanEnum.Profissional:
        return 10;
      case PlanEnum.Gratuito:
        return 1;
      default:
        return 0;
    }
  }
}

export { PlanService }