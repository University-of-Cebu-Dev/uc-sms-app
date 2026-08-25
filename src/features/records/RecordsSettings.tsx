import { useState } from 'react'
import type { PersonLookupType } from '@/services/personLookups'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { LookupTablePanel } from '@/features/records/LookupTablePanel'
import { SchoolsPanel } from '@/features/records/SchoolsPanel'

type CategoryKey = PersonLookupType | 'Schools'

const CATEGORIES: { key: CategoryKey; label: string; description: string }[] = [
  { key: 'PersonType', label: 'Person Types', description: 'Classifications such as Student, Parent, Employee.' },
  { key: 'RelationshipType', label: 'Relationship Types', description: 'Mother, Father, Guardian, Sibling, etc.' },
  { key: 'ContactType', label: 'Contact Types', description: 'Mobile, Landline, Email, Social, etc.' },
  { key: 'SectorType', label: 'Sector Types', description: 'PWD, Solo Parent, Indigenous, etc.' },
  { key: 'EducationLevel', label: 'Education Levels', description: 'Pre-Elementary through College.' },
  { key: 'Schools', label: 'Schools', description: 'Schools referenced by education history records.' },
]

export function RecordsSettings() {
  const [activeKey, setActiveKey] = useState<CategoryKey>('PersonType')
  const activeCategory = CATEGORIES.find((c) => c.key === activeKey)!

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
      <Card className="!p-2 h-fit">
        <nav className="space-y-1" aria-label="Records settings categories">
          {CATEGORIES.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveKey(category.key)}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                activeKey === category.key
                  ? 'bg-gh-accent text-gh-accent-fg'
                  : 'text-gh-fg-muted hover:bg-gh-canvas-subtle hover:text-gh-fg',
              )}
            >
              {category.label}
            </button>
          ))}
        </nav>
      </Card>

      {activeKey === 'Schools' ? (
        <SchoolsPanel />
      ) : (
        <LookupTablePanel type={activeKey} label={activeCategory.label} description={activeCategory.description} />
      )}
    </div>
  )
}
