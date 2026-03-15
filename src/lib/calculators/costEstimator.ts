export interface CostInputs {
  quantity: number     // net quantity
  unitCost: number     // dollars per unit
  wasteFactor: number  // percent e.g. 10 = 10%
}

export interface CostResults {
  netQuantity: number
  wasteQuantity: number
  grossQuantity: number
  totalCost: number
  unitLabel: string
}

export function calculateCost(inputs: CostInputs): CostResults | null {
  const { quantity, unitCost, wasteFactor } = inputs
  if (quantity <= 0 || unitCost < 0 || wasteFactor < 0) return null

  const wasteQuantity = quantity * (wasteFactor / 100)
  const grossQuantity = quantity + wasteQuantity
  const totalCost = grossQuantity * unitCost

  return {
    netQuantity: quantity,
    wasteQuantity,
    grossQuantity,
    totalCost,
    unitLabel: '',
  }
}
