import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Info,
  PlayCircle,
} from 'lucide-react'
import {
  studentEnrollmentSteps,
} from '@/features/enrollment/student/studentEnrollmentSteps'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const guideNotes = [
  'Complete the Admission flow before starting the Enrollment flow.',
  'Transferees must complete SAO / POD / Guidance before proceeding.',
  'Irregular or non-blocked students select course and class schedules in EMIS.',
  'Print and validate your study load at the Registrar when a hard copy is required.',
  'Blue highlight marks your current step; use Start to move forward one step at a time.',
]

export function StudentEnrollmentGuide() {
  const [progressIndex, setProgressIndex] = useState(-1)
  const currentStep =
    studentEnrollmentSteps[Math.min(progressIndex + 1, studentEnrollmentSteps.length - 1)]
  const completedCount = useMemo(() => Math.max(0, progressIndex + 1), [progressIndex])

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1.9fr]">
        <Card className="overflow-hidden border-gh-border/80 !p-0">
          <ol>
            {studentEnrollmentSteps.map((step, index) => {
              const isCompleted = index <= progressIndex
              const isActive = index === progressIndex + 1
              const isLocked = index > progressIndex + 1

              return (
                <li key={step.id}>
                  <div
                    className={cn(
                      'group border-b border-gh-border px-3 py-2.5 last:border-b-0',
                      isCompleted
                        ? 'bg-gh-success-subtle/25'
                        : isActive
                          ? 'bg-gh-accent text-gh-accent-fg'
                          : 'bg-gh-canvas hover:bg-gh-canvas-subtle/60',
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isActive ? 'text-gh-accent-fg' : 'text-gh-success',
                          )}
                          aria-hidden="true"
                        />
                      ) : (
                        <CircleDot
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isActive ? 'text-gh-accent-fg' : 'text-gh-fg-subtle',
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <p
                        className={cn(
                          'min-w-0 flex-1 text-sm leading-tight',
                          isActive ? 'font-semibold text-gh-accent-fg' : 'text-gh-fg',
                        )}
                      >
                        <span className="tabular-nums">{step.id}.</span> {step.title}
                        {step.note && (
                          <span
                            className={cn(
                              'mt-0.5 block text-[10px] font-normal',
                              isActive ? 'text-gh-accent-fg/85' : 'text-gh-fg-subtle',
                            )}
                          >
                            {step.note}
                          </span>
                        )}
                      </p>
                      {index === 0 ? (
                        <Button
                          type="button"
                          size="sm"
                          variant={isActive ? 'secondary' : isCompleted ? 'outline' : 'ghost'}
                          className={cn(
                            'h-7 shrink-0 rounded-md px-2 text-[11px]',
                            isActive &&
                              'border-white/40 bg-white/20 text-gh-accent-fg hover:bg-white/25',
                          )}
                          disabled={isLocked}
                          onClick={() => setProgressIndex(index)}
                        >
                          <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {isCompleted ? 'Started' : 'Start'}
                        </Button>
                      ) : (
                        !isActive &&
                        !isCompleted && (
                          <ChevronRight
                            className="h-3.5 w-3.5 text-gh-fg-subtle"
                            aria-hidden="true"
                          />
                        )
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </Card>

        <Card className="border-gh-border bg-[#edf5f2] !p-5">
          <h4 className="text-lg font-semibold text-gh-fg">
            Admission &amp; Enrollment Guide
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-gh-fg-muted">
            This guide follows the official admission and enrollment flow. Work through each step
            in order, from online registration through ID capture and printing.
          </p>

          <div className="mt-4 rounded-xl border border-gh-border/60 bg-white/80 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gh-fg-subtle">
                  Current active step
                </p>
                <p className="mt-1 text-base font-semibold text-gh-fg">
                  Step {currentStep.id}: {currentStep.title}
                </p>
              </div>
              <span className="rounded-full bg-gh-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gh-accent">
                {completedCount}/{studentEnrollmentSteps.length}
              </span>
            </div>
            {currentStep.note && (
              <p className="mt-2 text-xs font-medium text-gh-accent">{currentStep.note}</p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-gh-fg-muted">{currentStep.description}</p>
            <p className="mt-3 text-xs font-medium text-gh-fg-subtle">
              {completedCount} step(s) already started
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-gh-border/50 bg-white/60 p-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gh-accent" aria-hidden="true" />
              <p className="text-sm font-semibold text-gh-fg">Important reminders</p>
            </div>
            <div className="mt-3 space-y-2">
            {guideNotes.map((note) => (
              <p key={note} className="text-sm text-gh-fg-muted">
                • {note}
              </p>
            ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
