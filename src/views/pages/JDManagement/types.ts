export interface OrganizationChart {
  id: string
  name: string
  parentId?: string | null
  children?: OrganizationChart[]
}

export interface Node {
  id: string
  type?: string
  data: {
    label: string
    shape: string
    options: string[]
    usedRoles: string[]
    onChange?: (id: string, newLabel: string) => void
  }
  position: { x: number; y: number }
}

export interface Edge {
  id: string
  source: string
  target: string
  animated?: boolean
}
