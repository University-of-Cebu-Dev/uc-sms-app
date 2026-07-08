import { enrollmentTabs, type EnrollmentAudience } from '@/data/navConfig'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface EnrollmentAudiencePanelProps {
  audience: EnrollmentAudience
}

export function EnrollmentAudiencePanel({ audience }: EnrollmentAudiencePanelProps) {
  const tab = enrollmentTabs.find((item) => item.audience === audience)!
  const Icon = tab.icon

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="overflow-hidden !p-0">
        <div className="border-b border-gh-border bg-gradient-to-r from-gh-accent/[0.06] to-transparent p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gh-accent/10 text-gh-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gh-fg">{tab.label} enrollment</h3>
              <p className="mt-1 text-sm text-gh-fg-muted">{tab.description}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-dashed border-gh-border bg-gh-canvas-subtle/40 px-6 py-12 text-center">
            <Icon className="mx-auto h-10 w-10 text-gh-fg-subtle" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-gh-fg">
              {tab.label} enrollment workspace
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-gh-fg-muted">
              Manage {tab.label.toLowerCase()} enrollment for the selected school period.
              Application forms and workflows will appear here.
            </p>
            <Button type="button" size="sm" className="mt-5" disabled>
              Coming soon
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
