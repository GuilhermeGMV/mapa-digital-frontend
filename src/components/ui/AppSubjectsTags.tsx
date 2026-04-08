import React from 'react'
import type { TagContext } from '../../types/common'
import AppTags, { AppTag } from './AppTags'
import { type SubjectChipSize } from '../../utils/themes'

type AppSubjectTagProps = {
  size?: SubjectChipSize
  subject: TagContext
}

export function AppSubjectTag({ size = 'md', subject }: AppSubjectTagProps) {
  return <AppTag size={size} tag={subject} />
}

type AppSubjectsTagsProps = {
  size?: SubjectChipSize
  subjects: TagContext[]
}

export default function AppSubjectsTags({
  size = 'md',
  subjects,
}: AppSubjectsTagsProps) {
  return <AppTags size={size} tags={subjects} />
}
