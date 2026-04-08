import type { ReactNode } from 'react'

export type ApprovalType = 'content' | 'guardian'

export type ApprovalBadgeTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export interface ApprovalBadge {
  id: string
  label: string
  tone: ApprovalBadgeTone
}

export interface ApprovalCardStatus {
  label: string
  tone: ApprovalBadgeTone
}

export type ApprovalCardHelperTone = ApprovalBadgeTone

export interface ApprovalCardHelperText {
  text: string
  tone: ApprovalCardHelperTone
}

export interface ApprovalCardAction {
  accentColor?: string
  disabled?: boolean
  icon: ReactNode
  id: string
  label: string
  onClick: () => void
  tooltip?: string
}

interface BaseApprovalItem {
  id: string
  title: string
  subtitle: string
  badges: ApprovalBadge[]
}

export type ContentApprovalStatus =
  | 'inReview'
  | 'sent'
  | 'approved'
  | 'rejected'

export interface ContentApprovalItem extends BaseApprovalItem {
  id: string
  kind: 'content'
  status: ContentApprovalStatus
}

export type GuardianApprovalStatus =
  | 'pendingValidation'
  | 'approved'
  | 'rejected'

export interface GuardianApprovalValidation {
  hasDocument: boolean
  relationshipConfirmed: boolean
  studentLinked: boolean
}

export interface GuardianApprovalItem extends BaseApprovalItem {
  id: string
  kind: 'guardian'
  status: GuardianApprovalStatus
  childName: string
  validation: GuardianApprovalValidation
}

export type ApprovalItem = ContentApprovalItem | GuardianApprovalItem

export type ApprovalStatus =
  | ContentApprovalStatus
  | GuardianApprovalStatus
  | 'all'

export interface ApprovalFilter {
  query: string
  status: ApprovalStatus
}

export interface ApprovalQueueQuery extends ApprovalFilter {
  page: number
  pageSize: number
}

export interface ApprovalQueueResult<TItem> {
  currentPage: number
  items: TItem[]
  pageSize: number
  totalItems: number
  totalPages: number
}
