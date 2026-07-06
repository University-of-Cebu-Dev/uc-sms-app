import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  DoorOpen,
  GraduationCap,
  Search,
  Sparkles,
} from 'lucide-react'
import { useSchoolPeriod } from '@/hooks/useSchoolPeriod'
import { useToast } from '@/hooks/useToast'
import { programsApi } from '@/services/programs'
import type { ProgramEnrollment } from '@/types'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { cn } from '@/utils/cn'

interface TableToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  accentClass?: string
  disabled?: boolean
}

function TableToggle({
  checked,
  onChange,
  label,
  accentClass = 'bg-gh-accent',
  disabled = false,
}: TableToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative mx-auto block h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? accentClass : 'bg-gh-border',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}

export function ProgramManager() {
  const { selectedPeriod, isLoading: periodsLoading } = useSchoolPeriod()
  const { addToast } = useToast()
  const [programs, setPrograms] = useState<ProgramEnrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const loadPrograms = useCallback(async () => {
    if (!selectedPeriod) {
      setPrograms([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await programsApi.list(selectedPeriod.id)
      setPrograms(data)
    } catch {
      addToast('error', 'Load failed', 'Could not load programs for this period.')
      setPrograms([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedPeriod, addToast])

  useEffect(() => {
    void loadPrograms()
  }, [loadPrograms])

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return programs

    return programs.filter(
      (program) =>
        program.name.toLowerCase().includes(query) ||
        program.code.toLowerCase().includes(query) ||
        program.abbr.toLowerCase().includes(query),
    )
  }, [programs, search])

  const activeCount = programs.filter((program) => program.isActive).length
  const openCount = programs.filter((program) => program.openForEnroll).length

  const handleUpdate = async (
    programId: number,
    updates: Partial<Pick<ProgramEnrollment, 'isActive' | 'openForEnroll'>>,
  ) => {
    if (!selectedPeriod) return

    const previous = programs
    setPrograms((current) =>
      current.map((program) =>
        program.id === programId ? { ...program, ...updates } : program,
      ),
    )
    setSavingId(programId)

    try {
      const updated = await programsApi.update(selectedPeriod.id, programId, updates)
      setPrograms((current) =>
        current.map((program) => (program.id === programId ? updated : program)),
      )
    } catch {
      setPrograms(previous)
      addToast('error', 'Update failed', 'Could not save program settings.')
    } finally {
      setSavingId(null)
    }
  }

  if (periodsLoading) {
    return <Card className="!p-6 text-sm text-gh-fg-muted">Loading school period...</Card>
  }

  if (!selectedPeriod) {
    return (
      <Card className="!p-8 text-center">
        <BookOpen className="mx-auto h-8 w-8 text-gh-fg-subtle" />
        <p className="mt-3 text-sm font-medium text-gh-fg">No school period selected</p>
        <p className="mt-1 text-sm text-gh-fg-muted">
          Select a period from the sidebar to manage program enrollment.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: 'Total programs', value: programs.length, icon: BookOpen },
          { label: 'Active', value: activeCount, icon: CheckCircle2 },
          { label: 'Open for enrollment', value: openCount, icon: DoorOpen },
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
                <p className="mt-0.5 text-xl font-semibold leading-none text-gh-fg">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden !p-0">
        <div className="border-b border-gh-border bg-gradient-to-r from-sky-500/[0.06] to-transparent p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-600" aria-hidden="true" />
                <h3 className="text-base font-semibold text-gh-fg">Programs</h3>
              </div>
              <p className="mt-1 max-w-xl text-sm text-gh-fg-muted">
                Configure which programs are active and open for enrollment in{' '}
                <span className="font-medium text-gh-fg">{selectedPeriod.name}</span>.
              </p>
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-[2.35rem] h-4 w-4 text-gh-fg-subtle"
                aria-hidden="true"
              />
              <Input
                label="Search programs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, code, or abbreviation"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="p-5">
          {isLoading ? (
            <p className="text-sm text-gh-fg-muted">Loading programs...</p>
          ) : filteredPrograms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gh-border bg-gh-canvas-subtle/40 px-6 py-10 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-gh-fg-subtle" />
              <p className="mt-3 text-sm font-medium text-gh-fg">
                {search ? 'No programs match your search' : 'No programs found'}
              </p>
              <p className="mt-1 text-sm text-gh-fg-muted">
                {search
                  ? 'Try a different search term.'
                  : 'Programs from the academic catalog will appear here.'}
              </p>
            </div>
          ) : (
            <Table className="rounded-xl">
              <TableHeader>
                <TableRow className="hover:bg-gh-canvas-subtle">
                  <TableHead className="w-28">Code</TableHead>
                  <TableHead className="w-24">Abbr</TableHead>
                  <TableHead>Program name</TableHead>
                  <TableHead className="w-28 text-center">Active</TableHead>
                  <TableHead className="w-36 text-center">Open for enroll</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => {
                  const isSaving = savingId === program.id

                  return (
                    <TableRow
                      key={program.id}
                      className={cn(
                        isSaving && 'opacity-60',
                        program.isActive &&
                          program.openForEnroll &&
                          'bg-gh-accent/[0.03]',
                      )}
                    >
                      <TableCell className="font-mono text-xs text-gh-fg-muted">
                        {program.code || '—'}
                      </TableCell>
                      <TableCell>
                        {program.abbr ? (
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {program.abbr}
                          </Badge>
                        ) : (
                          <span className="text-gh-fg-subtle">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{program.name}</TableCell>
                      <TableCell className="text-center">
                        <TableToggle
                          checked={program.isActive}
                          onChange={(checked) =>
                            void handleUpdate(program.id, { isActive: checked })
                          }
                          label={`Set ${program.name} active`}
                          accentClass="bg-emerald-500"
                          disabled={isSaving}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <TableToggle
                          checked={program.openForEnroll}
                          onChange={(checked) =>
                            void handleUpdate(program.id, { openForEnroll: checked })
                          }
                          label={`Set ${program.name} open for enrollment`}
                          accentClass="bg-sky-500"
                          disabled={isSaving}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {program.isActive && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </span>
                          )}
                          {program.openForEnroll && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-400">
                              <DoorOpen className="h-3 w-3" />
                              Open
                            </span>
                          )}
                          {!program.isActive && !program.openForEnroll && (
                            <span className="text-xs text-gh-fg-subtle">Inactive</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  )
}
