export interface Approvals {
  id: string
  categoryName: string
  description?: string | null
  approvedCount: number
  rejectedCount?: number
  pendingCount: number
  freezeCount: number
  transferCount?: number
  overdue?: string | null
  moveTo?: string | null
}

export type ViewMode = 'grid' | 'table'
