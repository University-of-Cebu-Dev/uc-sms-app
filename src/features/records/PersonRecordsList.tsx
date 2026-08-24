import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw, Search, UserPlus } from 'lucide-react'
import { personsApi, formatPersonName, type CreatePersonPayload, type PersonSummary } from '@/services/persons'
import { personLookupsApi, type LookupItem } from '@/services/personLookups'
import { usePermissions } from '@/hooks/usePermissions'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { cn } from '@/utils/cn'

const GENDER_OPTIONS = ['Male', 'Female', 'Other']
const SEX_OPTIONS = ['M', 'F']
const CIVIL_STATUS_OPTIONS = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced']

interface PersonFormState {
  idNumber: string
  firstName: string
  middleName: string
  lastName: string
  suffixName: string
  title: string
  religion: string
  gender: string
  sex: string
  nationality: string
  civilStatus: string
  birthDate: string
  birthPlace: string
  occupation: string
  personTypeIds: number[]
}

const emptyForm: PersonFormState = {
  idNumber: '',
  firstName: '',
  middleName: '',
  lastName: '',
  suffixName: '',
  title: '',
  religion: '',
  gender: '',
  sex: '',
  nationality: '',
  civilStatus: '',
  birthDate: '',
  birthPlace: '',
  occupation: '',
  personTypeIds: [],
}

interface PersonRecordsListProps {
  personTypeCode: 'STUDENT' | 'PARENT'
  typeLabel: string
}

export function PersonRecordsList({ personTypeCode, typeLabel }: PersonRecordsListProps) {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { hasPermission } = usePermissions()
  const canCreate = hasPermission('UCSMS.StudentRecords.Create')

  const [persons, setPersons] = useState<PersonSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [personTypeOptions, setPersonTypeOptions] = useState<LookupItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<PersonFormState>(emptyForm)

  const loadPersons = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await personsApi.list({ personTypeCode })
      setPersons(data)
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 403
          ? `You don't have permission to view ${typeLabel} records.`
          : error instanceof ApiError
            ? error.message
            : `Could not load ${typeLabel} records.`
      setLoadError(message)
      setPersons([])
      addToast('error', 'Load failed', message)
    } finally {
      setIsLoading(false)
    }
  }, [personTypeCode, typeLabel, addToast])

  useEffect(() => {
    void loadPersons()
  }, [loadPersons])

  useEffect(() => {
    personLookupsApi
      .list('PersonType')
      .then((items) => setPersonTypeOptions(items.filter((item) => item.code === 'STUDENT' || item.code === 'PARENT')))
      .catch(() => setPersonTypeOptions([]))
  }, [])

  const filteredPersons = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return persons

    return persons.filter((person) => {
      const fullName = formatPersonName(person)
      return (
        fullName.toLowerCase().includes(query) ||
        person.idNumber.toLowerCase().includes(query)
      )
    })
  }, [persons, search])

  const openCreateModal = () => {
    const defaultTypeIds = personTypeOptions.filter((t) => t.code === personTypeCode).map((t) => t.id)
    setForm({ ...emptyForm, personTypeIds: defaultTypeIds })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  const togglePersonType = (typeId: number) => {
    setForm((current) => ({
      ...current,
      personTypeIds: current.personTypeIds.includes(typeId)
        ? current.personTypeIds.filter((id) => id !== typeId)
        : [...current.personTypeIds, typeId],
    }))
  }

  const handleCreate = async () => {
    if (form.personTypeIds.length === 0) {
      addToast('warning', 'Person type required', 'Select whether this person is a Student, Parent, or both.')
      return
    }

    setIsSaving(true)
    try {
      const payload: CreatePersonPayload = {
        id_number: form.idNumber.trim(),
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        middle_name: form.middleName.trim(),
        suffix: form.suffixName.trim(),
        title: form.title.trim(),
        religion: form.religion.trim(),
        gender: form.gender,
        sex: form.sex,
        nationality: form.nationality.trim(),
        civil_status: form.civilStatus,
        birthdate: form.birthDate,
        birthplace: form.birthPlace.trim(),
        occupation: form.occupation.trim(),
      }

      const created = await personsApi.create(payload)
      await personsApi.assignTypes(created.id, form.personTypeIds)

      addToast('success', 'Person added', `${formatPersonName(form as unknown as PersonSummary) || payload.first_name} was created successfully.`)
      closeModal()
      await loadPersons()
      navigate(`/records/${created.id}`)
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Could not create the person record.'
      addToast('error', 'Save failed', message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <Card className="!p-4 sm:w-64">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gh-fg-subtle">
          Total {typeLabel}s
        </p>
        <p className="mt-1 text-xl font-semibold text-gh-fg">{persons.length}</p>
      </Card>

      <Card className="overflow-hidden !p-0">
        <div className="flex flex-col gap-4 border-b border-gh-border bg-gh-canvas-subtle/50 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gh-fg-subtle"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or ID number..."
              className="pl-9"
              aria-label={`Search ${typeLabel} records`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadPersons()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {canCreate && (
              <Button size="sm" onClick={openCreateModal}>
                <Plus className="h-4 w-4" />
                Add {typeLabel}
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Spinner label={`Loading ${typeLabel} records`} />
          </div>
        ) : loadError ? (
          <p className="px-4 py-8 text-center text-sm text-gh-fg-muted">{loadError}</p>
        ) : filteredPersons.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <UserPlus className="mx-auto h-8 w-8 text-gh-fg-subtle" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-gh-fg">
              {search ? `No ${typeLabel}s match your search` : `No ${typeLabel}s registered yet`}
            </p>
            <p className="mt-1 text-sm text-gh-fg-muted">
              {search ? 'Try a different search term.' : `Add a ${typeLabel} record to get started.`}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersons.map((person) => (
                <TableRow key={person.id} onClick={() => navigate(`/records/${person.id}`)}>
                  <TableCell className="font-medium">{formatPersonName(person)}</TableCell>
                  <TableCell className="font-mono text-xs text-gh-fg-muted">{person.idNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {person.personTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-[10px]">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(`/records/${person.id}`)
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Add ${typeLabel}`}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={() => void handleCreate()} loading={isSaving}>
              Create person
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gh-fg">Person type</p>
            <p className="mt-0.5 text-xs text-gh-fg-muted">Select at least one.</p>
            <div className="mt-2 flex gap-2">
              {personTypeOptions.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => togglePersonType(type.id)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                    form.personTypeIds.includes(type.id)
                      ? 'border-gh-accent/40 bg-gh-accent/8 text-gh-accent ring-1 ring-gh-accent/20'
                      : 'border-gh-border text-gh-fg-muted hover:bg-gh-canvas-subtle',
                  )}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="ID number"
              value={form.idNumber}
              maxLength={8}
              hint="Up to 8 characters."
              onChange={(event) => setForm((current) => ({ ...current, idNumber: event.target.value }))}
            />
            <Input
              label="Birth date"
              type="date"
              value={form.birthDate}
              onChange={(event) => setForm((current) => ({ ...current, birthDate: event.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="First name"
              value={form.firstName}
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            />
            <Input
              label="Middle name"
              value={form.middleName}
              onChange={(event) => setForm((current) => ({ ...current, middleName: event.target.value }))}
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Suffix"
              value={form.suffixName}
              onChange={(event) => setForm((current) => ({ ...current, suffixName: event.target.value }))}
              placeholder="Jr., III, etc."
            />
            <Input
              label="Title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gh-fg">Gender</label>
              <select
                value={form.gender}
                onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
                className="w-full rounded-md border border-gh-border bg-gh-canvas px-3 py-2 text-sm text-gh-fg focus:border-gh-accent focus:outline-none focus:ring-1 focus:ring-gh-accent"
              >
                <option value="">Select...</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gh-fg">Sex</label>
              <select
                value={form.sex}
                onChange={(event) => setForm((current) => ({ ...current, sex: event.target.value }))}
                className="w-full rounded-md border border-gh-border bg-gh-canvas px-3 py-2 text-sm text-gh-fg focus:border-gh-accent focus:outline-none focus:ring-1 focus:ring-gh-accent"
              >
                <option value="">Select...</option>
                {SEX_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gh-fg">Civil status</label>
              <select
                value={form.civilStatus}
                onChange={(event) => setForm((current) => ({ ...current, civilStatus: event.target.value }))}
                className="w-full rounded-md border border-gh-border bg-gh-canvas px-3 py-2 text-sm text-gh-fg focus:border-gh-accent focus:outline-none focus:ring-1 focus:ring-gh-accent"
              >
                <option value="">Select...</option>
                {CIVIL_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Religion"
              value={form.religion}
              onChange={(event) => setForm((current) => ({ ...current, religion: event.target.value }))}
            />
            <Input
              label="Nationality"
              value={form.nationality}
              onChange={(event) => setForm((current) => ({ ...current, nationality: event.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Birth place"
              value={form.birthPlace}
              onChange={(event) => setForm((current) => ({ ...current, birthPlace: event.target.value }))}
              placeholder="City, Province, Country"
            />
            <Input
              label="Occupation"
              value={form.occupation}
              onChange={(event) => setForm((current) => ({ ...current, occupation: event.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
