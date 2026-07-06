import type { EducationLevelId, LevelEnrollmentConfig, SchoolPeriod, StudentTypeId } from '@/types'
import { ALL_STUDENT_TYPE_IDS } from '@/data/studentTypes'

export const isLevelEnabled = (period: SchoolPeriod, levelId: EducationLevelId) =>
  period.levelConfigs.some((config) => config.levelId === levelId)

export const getLevelStudentTypes = (
  period: SchoolPeriod,
  levelId: EducationLevelId,
): StudentTypeId[] =>
  period.levelConfigs.find((config) => config.levelId === levelId)?.studentTypes ?? []

export const createLevelConfig = (
  levelId: EducationLevelId,
  studentTypes: StudentTypeId[] = [...ALL_STUDENT_TYPE_IDS],
): LevelEnrollmentConfig => ({
  levelId,
  studentTypes,
})
