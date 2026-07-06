import { useState, type FormEvent } from 'react'
import {
  BookMarked,
  CalendarDays,
  CalendarRange,
  Check,
  Layers,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import type { EducationLevelId, LevelEnrollmentConfig, SchoolPeriod, StudentTypeId } from '@/types'
import { EDUCATION_LEVELS } from '@/data/educationLevels'
import { ALL_STUDENT_TYPE_IDS, STUDENT_TYPES } from '@/data/studentTypes'
import { useSchoolPeriod } from '@/hooks/useSchoolPeriod'
import { useToast } from '@/hooks/useToast'
import { formatDate } from '@/utils/format'
import {
  createLevelConfig,
  getLevelStudentTypes,
  isLevelEnabled,
} from '@/utils/schoolPeriodLevels'
import { derivePeriodFieldsFromActiveTerm, isActiveTermCode } from '@/utils/activeTerm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

const statusVariant = {
  active: 'success',
  upcoming: 'info',
  completed: 'outline',
} as const

type PeriodForm = {
  activeTerm: string
  name: string
  term: string
  startDate: string
  endDate: string
  status: SchoolPeriod['status']
  levelConfigs: LevelEnrollmentConfig[]
}

const emptyForm: PeriodForm = {
  activeTerm: '',
  name: '',
  term: '',
  startDate: '',
  endDate: '',
  status: 'upcoming',
  levelConfigs: [createLevelConfig('college')],
}

function applyActiveTerm(activeTerm: string): Pick<PeriodForm, 'activeTerm' | 'name' | 'term'> {
  const derived = derivePeriodFieldsFromActiveTerm(activeTerm)
  return {
    activeTerm,
    name: derived?.name ?? '',
    term: derived?.term ?? '',
  }
}

function countAllowedTypes(period: SchoolPeriod) {
  return period.levelConfigs.reduce((sum, config) => sum + config.studentTypes.length, 0)
}

interface LevelStudentTypesProps {
  studentTypes: StudentTypeId[]
  onToggle: (studentType: StudentTypeId) => void
  onSelectAll?: () => void
  onClearAll?: () => void
}

function LevelStudentTypes({
  studentTypes,
  onToggle,
  onSelectAll,
  onClearAll,
}: LevelStudentTypesProps) {
  return (
    <div className="mt-3 rounded-lg border border-gh-border/80 bg-gh-canvas-subtle/50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gh-fg-subtle">
          Allowed student types
        </p>
        {onSelectAll && onClearAll && (
          <div className="flex gap-2 text-[10px] font-medium">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-gh-accent hover:underline"
            >
              Select all
            </button>
            <span className="text-gh-fg-subtle" aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-gh-fg-muted hover:text-gh-fg hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {STUDENT_TYPES.map(({ id, label }) => {
          const isAllowed = studentTypes.includes(id)

          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggle(id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150',
                isAllowed
                  ? 'border-gh-accent/50 bg-gh-accent text-gh-accent-fg shadow-sm shadow-gh-accent/20'
                  : 'border-gh-border bg-gh-canvas text-gh-fg-muted hover:border-gh-accent/30 hover:bg-gh-canvas-subtle',
              )}
            >
              {isAllowed && <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />}
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface LevelConfigPanelProps {
  levelId: EducationLevelId
  enabled: boolean
  studentTypes: StudentTypeId[]
  onToggleLevel: () => void
  onToggleStudentType: (studentType: StudentTypeId) => void
  onSelectAll?: () => void
  onClearAll?: () => void
}

function LevelConfigPanel({
  levelId,
  enabled,
  studentTypes,
  onToggleLevel,
  onToggleStudentType,
  onSelectAll,
  onClearAll,
}: LevelConfigPanelProps) {
  const level = EDUCATION_LEVELS.find((item) => item.id === levelId)!
  const Icon = level.icon

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200 overflow-hidden',
        enabled
          ? 'border-gh-accent/25 bg-gh-canvas shadow-sm'
          : 'border-gh-border bg-gh-canvas-subtle/30',
      )}
    >
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br',
              enabled ? level.accent : 'from-gh-canvas-subtle to-gh-canvas text-gh-fg-subtle',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className={cn('text-sm font-semibold', enabled ? 'text-gh-fg' : 'text-gh-fg-muted')}>
              {level.label}
            </p>
            <p className="text-[11px] text-gh-fg-subtle">
              {enabled
                ? `${studentTypes.length} of ${STUDENT_TYPES.length} types allowed`
                : 'Not enabled for this period'}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={onToggleLevel}
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
            enabled ? 'bg-gh-accent' : 'bg-gh-border',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
              enabled && 'translate-x-5',
            )}
          />
        </button>
      </div>

      {enabled && (
        <div className="border-t border-gh-border/80 px-3 pb-3">
          <LevelStudentTypes
            studentTypes={studentTypes}
            onToggle={onToggleStudentType}
            onSelectAll={onSelectAll}
            onClearAll={onClearAll}
          />
        </div>
      )}
    </div>
  )
}

export function SchoolPeriodManager() {
  const {
    periods,
    isLoading,
    addPeriod,
    updatePeriod,
    deletePeriod,
    togglePeriodLevel,
    toggleStudentType,
  } = useSchoolPeriod()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PeriodForm>(emptyForm)
  const activeTermError =
    !editingId && form.activeTerm.length > 0 && !isActiveTermCode(form.activeTerm)
      ? 'Enter a valid 5-digit term code.'
      : !editingId &&
          isActiveTermCode(form.activeTerm) &&
          !derivePeriodFieldsFromActiveTerm(form.activeTerm)
        ? 'Last digit must be 1 (1st sem), 2 (2nd sem), or 4 (summer).'
        : undefined

  const activeCount = periods.filter((period) => period.status === 'active').length

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (period: SchoolPeriod) => {
    setEditingId(period.id)
    setForm({
      activeTerm: period.activeTerm ?? '',
      name: period.name,
      term: period.term,
      startDate: period.startDate,
      endDate: period.endDate,
      status: period.status,
      levelConfigs: period.levelConfigs.map((config) => ({
        levelId: config.levelId,
        studentTypes: [...config.studentTypes],
      })),
    })
    setShowForm(true)
  }

  const handleActiveTermChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 5)
    setForm((prev) => ({ ...prev, ...applyActiveTerm(digits) }))
  }

  const toggleFormLevel = (level: EducationLevelId) => {
    setForm((prev) => {
      const exists = prev.levelConfigs.some((config) => config.levelId === level)
      return {
        ...prev,
        levelConfigs: exists
          ? prev.levelConfigs.filter((config) => config.levelId !== level)
          : [...prev.levelConfigs, createLevelConfig(level)],
      }
    })
  }

  const setFormLevelStudentTypes = (level: EducationLevelId, studentTypes: StudentTypeId[]) => {
    setForm((prev) => ({
      ...prev,
      levelConfigs: prev.levelConfigs.map((config) =>
        config.levelId === level ? { ...config, studentTypes } : config,
      ),
    }))
  }

  const toggleFormStudentType = (level: EducationLevelId, studentType: StudentTypeId) => {
    setForm((prev) => ({
      ...prev,
      levelConfigs: prev.levelConfigs.map((config) => {
        if (config.levelId !== level) return config
        const hasType = config.studentTypes.includes(studentType)
        return {
          ...config,
          studentTypes: hasType
            ? config.studentTypes.filter((type) => type !== studentType)
            : [...config.studentTypes, studentType],
        }
      }),
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!editingId && !isActiveTermCode(form.activeTerm)) {
      addToast('warning', 'Invalid active term', 'Enter a 5-digit term code (e.g. 20271).')
      return
    }

    if (!form.name.trim() || !form.startDate || !form.endDate) {
      addToast('warning', 'Missing fields', 'Please complete all required fields.')
      return
    }

    if (form.levelConfigs.length === 0) {
      addToast('warning', 'No levels selected', 'Select at least one education level.')
      return
    }

    const invalidLevel = form.levelConfigs.find((config) => config.studentTypes.length === 0)
    if (invalidLevel) {
      const label = EDUCATION_LEVELS.find((level) => level.id === invalidLevel.levelId)?.label
      addToast('warning', 'No student types', `Select allowed student types for ${label}.`)
      return
    }

    const payload = {
      name: form.name.trim(),
      term: form.term.trim() || form.name.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      levelConfigs: form.levelConfigs.map((config) => ({
        levelId: config.levelId,
        studentTypes: [...config.studentTypes],
      })),
    }

    try {
      if (editingId) {
        await updatePeriod(editingId, payload)
        addToast('success', 'Period updated', `${payload.name} has been saved.`)
      } else {
        await addPeriod({ ...payload, activeTerm: form.activeTerm.trim() })
        addToast('success', 'Period added', `${payload.name} is now available.`)
      }
      resetForm()
    } catch {
      addToast('error', 'Save failed', 'Could not save the school period.')
    }
  }

  const handleDelete = async (period: SchoolPeriod) => {
    if (periods.length <= 1) {
      addToast('warning', 'Cannot delete', 'At least one school period is required.')
      return
    }

    try {
      await deletePeriod(period.id)
      addToast('info', 'Period removed', `${period.name} was deleted.`)
      if (editingId === period.id) resetForm()
    } catch {
      addToast('error', 'Delete failed', 'Could not delete the school period.')
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Card className="!p-6 text-sm text-gh-fg-muted">Loading school periods...</Card>
      ) : (
        <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Total periods', value: periods.length, icon: CalendarRange },
          { label: 'Active now', value: activeCount, icon: CalendarDays },
          {
            label: 'Education levels',
            value: EDUCATION_LEVELS.length,
            icon: Layers,
          },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="!p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gh-accent/10 text-gh-accent">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gh-fg-subtle">
                  {label}
                </p>
                <p className="text-xl font-semibold text-gh-fg leading-none mt-0.5">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden !p-0">
        <div className="flex flex-col gap-4 border-b border-gh-border bg-gradient-to-r from-gh-accent/[0.06] to-transparent p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-gh-accent" aria-hidden="true" />
              <h3 className="text-base font-semibold text-gh-fg">School Periods</h3>
            </div>
            <p className="mt-1 text-sm text-gh-fg-muted max-w-xl">
              Manage enrollment windows, education levels, and which student types can enroll.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={showForm && !editingId ? 'secondary' : 'primary'}
            onClick={() => {
              if (showForm && !editingId) resetForm()
              else {
                setEditingId(null)
                setForm(emptyForm)
                setShowForm(true)
              }
            }}
          >
            {showForm && !editingId ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add period
              </>
            )}
          </Button>
        </div>

        <div className="p-5 space-y-4">
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gh-accent/20 bg-gh-accent/[0.03] p-5 space-y-5 animate-fade-in"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gh-fg">
                  {editingId ? 'Edit school period' : 'New school period'}
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md p-1 text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg"
                  aria-label="Close form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Active term"
                  value={form.activeTerm}
                  onChange={(e) => handleActiveTermChange(e.target.value)}
                  placeholder="e.g. 20271"
                  hint={
                    editingId
                      ? 'Active term cannot be changed after creation.'
                      : '5-digit code: end year + term (1 = 1st sem, 2 = 2nd sem, 4 = summer)'
                  }
                  error={activeTermError}
                  disabled={Boolean(editingId)}
                  required={!editingId}
                  inputMode="numeric"
                  maxLength={5}
                  className="sm:max-w-xs"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Period name"
                    value={form.name}
                    onChange={() => undefined}
                    placeholder="Auto-filled from active term"
                    disabled
                    required
                  />
                  <Input
                    label="Term label"
                    value={form.term}
                    onChange={() => undefined}
                    placeholder="Auto-filled from active term"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Start date"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                  <Input
                    label="End date"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="period-status" className="text-sm font-medium text-gh-fg">
                  Status
                </label>
                <select
                  id="period-status"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as SchoolPeriod['status'],
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-gh-border bg-gh-canvas px-3 py-2.5 text-sm text-gh-fg focus:border-gh-accent focus:ring-1 focus:ring-gh-accent focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gh-fg">Education levels & student types</p>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-1">
                  {EDUCATION_LEVELS.map(({ id }) => {
                    const config = form.levelConfigs.find((item) => item.levelId === id)
                    return (
                      <LevelConfigPanel
                        key={id}
                        levelId={id}
                        enabled={Boolean(config)}
                        studentTypes={config?.studentTypes ?? []}
                        onToggleLevel={() => toggleFormLevel(id)}
                        onToggleStudentType={(type) => toggleFormStudentType(id, type)}
                        onSelectAll={() => setFormLevelStudentTypes(id, [...ALL_STUDENT_TYPE_IDS])}
                        onClearAll={() => setFormLevelStudentTypes(id, [])}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="submit" size="sm">
                  {editingId ? 'Save changes' : 'Add period'}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {periods.map((period) => (
              <article
                key={period.id}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border transition-all duration-200',
                  period.status === 'active'
                    ? 'border-gh-accent/30 bg-gh-canvas shadow-md shadow-gh-accent/5'
                    : 'border-gh-border bg-gh-canvas hover:border-gh-accent/20 hover:shadow-sm',
                )}
              >
                {period.status === 'active' && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-gh-accent" aria-hidden="true" />
                )}

                <div className="p-5 pl-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gh-accent/10 text-gh-accent">
                        <CalendarDays className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-semibold text-gh-fg">{period.name}</h4>
                          {period.activeTerm && (
                            <span className="rounded-md bg-gh-canvas-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-gh-fg-muted">
                              {period.activeTerm}
                            </span>
                          )}
                          <Badge variant={statusVariant[period.status]}>{period.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-gh-fg-muted">
                          {formatDate(period.startDate)} – {formatDate(period.endDate)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gh-canvas-subtle px-2.5 py-0.5 text-[11px] font-medium text-gh-fg-muted">
                            <Layers className="h-3 w-3" aria-hidden="true" />
                            {period.levelConfigs.length} level
                            {period.levelConfigs.length === 1 ? '' : 's'}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-gh-canvas-subtle px-2.5 py-0.5 text-[11px] font-medium text-gh-fg-muted">
                            <Users className="h-3 w-3" aria-hidden="true" />
                            {countAllowedTypes(period)} enrollment type
                            {countAllowedTypes(period) === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1 lg:opacity-80 lg:group-hover:opacity-100">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(period)}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(period)}
                        aria-label={`Delete ${period.name}`}
                        className="text-gh-danger hover:bg-gh-danger-subtle hover:text-gh-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3">
                    {EDUCATION_LEVELS.map(({ id }) => (
                      <LevelConfigPanel
                        key={id}
                        levelId={id}
                        enabled={isLevelEnabled(period, id)}
                        studentTypes={getLevelStudentTypes(period, id)}
                        onToggleLevel={() => {
                          void togglePeriodLevel(period.id, id).then(() => {
                            const label = EDUCATION_LEVELS.find((level) => level.id === id)?.label
                            addToast(
                              'info',
                              isLevelEnabled(period, id) ? 'Level removed' : 'Level added',
                              `${label} updated for ${period.name}.`,
                            )
                          }).catch(() => {
                            addToast('error', 'Update failed', 'Could not update education level.')
                          })
                        }}
                        onToggleStudentType={(type) => {
                          void toggleStudentType(period.id, id, type).catch(() => {
                            addToast('error', 'Update failed', 'Could not update student type.')
                          })
                        }}
                        onSelectAll={() => {
                          void updatePeriod(period.id, {
                            levelConfigs: period.levelConfigs.map((config) =>
                              config.levelId === id
                                ? { ...config, studentTypes: [...ALL_STUDENT_TYPE_IDS] }
                                : config,
                            ),
                          }).catch(() => {
                            addToast('error', 'Update failed', 'Could not update student types.')
                          })
                        }}
                        onClearAll={() => {
                          void updatePeriod(period.id, {
                            levelConfigs: period.levelConfigs.map((config) =>
                              config.levelId === id ? { ...config, studentTypes: [] } : config,
                            ),
                          }).catch(() => {
                            addToast('error', 'Update failed', 'Could not update student types.')
                          })
                        }}
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Card>
        </>
      )}
    </div>
  )
}
