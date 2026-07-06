import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { EducationLevelId, LevelEnrollmentConfig, SchoolPeriod, StudentTypeId } from '@/types'
import { createLevelConfig } from '@/utils/schoolPeriodLevels'
import { schoolPeriodsApi, type CreateSchoolPeriodPayload } from '@/services/schoolPeriods'
import { usersApi } from '@/services/users'
import { useAuth } from '@/hooks/useAuth'

interface SchoolPeriodContextValue {
  periods: SchoolPeriod[]
  selectedPeriod: SchoolPeriod | null
  selectedPeriodId: string
  isLoading: boolean
  setSelectedPeriodId: (id: string) => void
  addPeriod: (period: CreateSchoolPeriodPayload) => Promise<void>
  updatePeriod: (id: string, updates: Partial<SchoolPeriod>) => Promise<void>
  deletePeriod: (id: string) => Promise<void>
  togglePeriodLevel: (periodId: string, level: EducationLevelId) => Promise<void>
  toggleStudentType: (
    periodId: string,
    level: EducationLevelId,
    studentType: StudentTypeId,
  ) => Promise<void>
  refreshPeriods: () => Promise<void>
}

const SchoolPeriodContext = createContext<SchoolPeriodContextValue | null>(null)

export const SchoolPeriodProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const [periods, setPeriods] = useState<SchoolPeriod[]>([])
  const [selectedPeriodId, setSelectedPeriodIdState] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const refreshPeriods = useCallback(async () => {
    if (!isAuthenticated) {
      setPeriods([])
      setSelectedPeriodIdState('')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const [periodList, preferences] = await Promise.all([
        schoolPeriodsApi.list(),
        usersApi.getPreferences().catch(() => null),
      ])

      setPeriods(periodList)

      const preferredId = preferences?.selectedPeriodId
      const nextSelected =
        preferredId && periodList.some((period) => period.id === preferredId)
          ? preferredId
          : periodList[0]?.id ?? ''

      setSelectedPeriodIdState(nextSelected)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    void refreshPeriods()
  }, [refreshPeriods])

  const setSelectedPeriodId = useCallback(
    async (id: string) => {
      setSelectedPeriodIdState(id)
      if (!isAuthenticated) return

      try {
        await usersApi.updatePreferences({ selectedPeriodId: id })
      } catch {
        // keep local selection even if preference sync fails
      }
    },
    [isAuthenticated],
  )

  const selectedPeriod = periods.find((period) => period.id === selectedPeriodId) ?? periods[0] ?? null

  const addPeriod = useCallback(async (period: CreateSchoolPeriodPayload) => {
    const created = await schoolPeriodsApi.create(period)
    setPeriods((prev) => [...prev, created])
  }, [])

  const updatePeriod = useCallback(async (id: string, updates: Partial<SchoolPeriod>) => {
    const updated = await schoolPeriodsApi.update(id, updates)
    setPeriods((prev) => prev.map((period) => (period.id === id ? updated : period)))
  }, [])

  const deletePeriod = useCallback(
    async (id: string) => {
      await schoolPeriodsApi.remove(id)
      setPeriods((prev) => {
        const next = prev.filter((period) => period.id !== id)
        if (selectedPeriodId === id && next[0]) {
          void setSelectedPeriodId(next[0].id)
        }
        return next
      })
    },
    [selectedPeriodId, setSelectedPeriodId],
  )

  const togglePeriodLevel = useCallback(
    async (periodId: string, level: EducationLevelId) => {
      const period = periods.find((item) => item.id === periodId)
      if (!period) return

      const existing = period.levelConfigs.find((config) => config.levelId === level)
      const levelConfigs: LevelEnrollmentConfig[] = existing
        ? period.levelConfigs.filter((config) => config.levelId !== level)
        : [...period.levelConfigs, createLevelConfig(level)]

      await updatePeriod(periodId, { levelConfigs })
    },
    [periods, updatePeriod],
  )

  const toggleStudentType = useCallback(
    async (periodId: string, level: EducationLevelId, studentType: StudentTypeId) => {
      const period = periods.find((item) => item.id === periodId)
      if (!period) return

      const levelConfigs = period.levelConfigs.map((config) => {
        if (config.levelId !== level) return config

        const hasType = config.studentTypes.includes(studentType)
        const studentTypes = hasType
          ? config.studentTypes.filter((type) => type !== studentType)
          : [...config.studentTypes, studentType]

        return { ...config, studentTypes }
      })

      await updatePeriod(periodId, { levelConfigs })
    },
    [periods, updatePeriod],
  )

  return (
    <SchoolPeriodContext.Provider
      value={{
        periods,
        selectedPeriod,
        selectedPeriodId,
        isLoading,
        setSelectedPeriodId,
        addPeriod,
        updatePeriod,
        deletePeriod,
        togglePeriodLevel,
        toggleStudentType,
        refreshPeriods,
      }}
    >
      {children}
    </SchoolPeriodContext.Provider>
  )
}

export const useSchoolPeriod = () => {
  const ctx = useContext(SchoolPeriodContext)
  if (!ctx) throw new Error('useSchoolPeriod must be used within SchoolPeriodProvider')
  return ctx
}
