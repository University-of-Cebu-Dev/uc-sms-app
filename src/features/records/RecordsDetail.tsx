import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Contact as ContactIcon,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Pencil,
  Plus,
  Shield,
  Trash2,
  User,
} from 'lucide-react'
import {
  personsApi,
  formatPersonName,
  type Address,
  type Contact,
  type EducationHistory,
  type PersonDetail,
  type SectoralIdentification,
  type UpdatePersonPayload,
} from '@/services/persons'
import { personLookupsApi, type LookupItem, type SchoolInfo } from '@/services/personLookups'
import { usePermissions } from '@/hooks/usePermissions'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'

const GENDER_OPTIONS = ['Male', 'Female', 'Other']
const SEX_OPTIONS = ['M', 'F']
const CIVIL_STATUS_OPTIONS = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced']
const ADDRESS_TYPE_OPTIONS = ['City', 'Province', 'Foreign']

function selectClassName() {
  return 'w-full rounded-md border border-gh-border bg-gh-canvas px-3 py-2 text-sm text-gh-fg focus:border-gh-accent focus:outline-none focus:ring-1 focus:ring-gh-accent'
}

function SectionCard({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gh-border bg-gh-canvas-subtle/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gh-accent/10 text-gh-accent">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-gh-fg">{title}</h3>
            {description && <p className="text-xs text-gh-fg-muted">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  )
}

function RowActions({ onEdit, onDelete, canUpdate, canDelete }: { onEdit?: () => void; onDelete: () => void; canUpdate: boolean; canDelete: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {onEdit && canUpdate && (
        <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-gh-danger hover:bg-gh-danger-subtle hover:text-gh-danger"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}

export function RecordsDetail() {
  const { id } = useParams<{ id: string }>()
  const personId = Number(id)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission('UCSMS.StudentRecords.Update')
  const canDelete = hasPermission('UCSMS.StudentRecords.Delete')

  const [person, setPerson] = useState<PersonDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [personTypeOptions, setPersonTypeOptions] = useState<LookupItem[]>([])
  const [relationshipTypeOptions, setRelationshipTypeOptions] = useState<LookupItem[]>([])
  const [contactTypeOptions, setContactTypeOptions] = useState<LookupItem[]>([])
  const [educationLevelOptions, setEducationLevelOptions] = useState<LookupItem[]>([])
  const [sectorTypeOptions, setSectorTypeOptions] = useState<LookupItem[]>([])
  const [schools, setSchools] = useState<SchoolInfo[]>([])
  const [relatedNames, setRelatedNames] = useState<Record<number, string>>({})

  const load = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await personsApi.getById(personId)
      setPerson(data)
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 404
          ? 'This person record was not found.'
          : error instanceof ApiError && error.status === 403
            ? "You don't have permission to view this record."
            : 'Could not load this person record.'
      setLoadError(message)
    } finally {
      setIsLoading(false)
    }
  }, [personId])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    personLookupsApi.list('PersonType').then(setPersonTypeOptions).catch(() => setPersonTypeOptions([]))
    personLookupsApi.list('RelationshipType').then(setRelationshipTypeOptions).catch(() => setRelationshipTypeOptions([]))
    personLookupsApi.list('ContactType').then(setContactTypeOptions).catch(() => setContactTypeOptions([]))
    personLookupsApi.list('EducationLevel').then(setEducationLevelOptions).catch(() => setEducationLevelOptions([]))
    personLookupsApi.list('SectorType').then(setSectorTypeOptions).catch(() => setSectorTypeOptions([]))
    personLookupsApi.listSchools().then(setSchools).catch(() => setSchools([]))
  }, [])

  useEffect(() => {
    if (!person) return
    const otherIds = person.relationships.map((r) => (r.fromPersonId === person.id ? r.toPersonId : r.fromPersonId))
    const missing = [...new Set(otherIds)].filter((otherId) => !(otherId in relatedNames))
    if (missing.length === 0) return

    void Promise.all(
      missing.map(async (otherId) => {
        try {
          const other = await personsApi.getById(otherId)
          return [otherId, formatPersonName(other)] as const
        } catch {
          return [otherId, `Person #${otherId}`] as const
        }
      }),
    ).then((entries) => {
      setRelatedNames((current) => ({ ...current, ...Object.fromEntries(entries) }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person])

  // --- Basic info edit ---
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [infoForm, setInfoForm] = useState<UpdatePersonPayload | null>(null)
  const [isSavingInfo, setIsSavingInfo] = useState(false)

  const openInfoModal = () => {
    if (!person) return
    setInfoForm({
      firstName: person.firstName,
      lastName: person.lastName,
      middleName: person.middleName,
      suffixName: person.suffixName,
      title: person.title,
      religion: person.religion,
      gender: person.gender,
      sex: person.sex,
      nationality: person.nationality,
      civilStatus: person.civilStatus,
      birthDate: person.birthDate,
      birthPlace: person.birthPlace,
      occupation: person.occupation,
    })
    setIsInfoModalOpen(true)
  }

  const handleSaveInfo = async () => {
    if (!infoForm) return
    setIsSavingInfo(true)
    try {
      const updated = await personsApi.update(personId, infoForm)
      setPerson(updated)
      addToast('success', 'Person updated', 'Basic information was saved.')
      setIsInfoModalOpen(false)
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not save changes.')
    } finally {
      setIsSavingInfo(false)
    }
  }

  const handleDeletePerson = async () => {
    if (!person) return
    try {
      await personsApi.remove(personId)
      addToast('info', 'Person deleted', `${formatPersonName(person)} was removed.`)
      navigate('/records')
    } catch (error) {
      addToast('error', 'Delete failed', error instanceof ApiError ? error.message : 'Could not delete this person.')
    }
  }

  // --- Person types ---
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false)
  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([])
  const [isSavingTypes, setIsSavingTypes] = useState(false)

  const openTypesModal = () => {
    if (!person) return
    const ids = personTypeOptions.filter((t) => person.personTypes.includes(t.name ?? '')).map((t) => t.id)
    setSelectedTypeIds(ids)
    setIsTypesModalOpen(true)
  }

  const handleSaveTypes = async () => {
    setIsSavingTypes(true)
    try {
      const names = await personsApi.assignTypes(personId, selectedTypeIds)
      setPerson((current) => (current ? { ...current, personTypes: names } : current))
      addToast('success', 'Types updated', 'Person types were saved.')
      setIsTypesModalOpen(false)
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not update person types.')
    } finally {
      setIsSavingTypes(false)
    }
  }

  // --- Addresses ---
  const [addressModal, setAddressModal] = useState<{ open: boolean; editing: Address | null }>({ open: false, editing: null })
  const [addressForm, setAddressForm] = useState({ type: 'City', houseAddress: '', barangay: '', city: '', province: '', country: '', zipCode: '' })
  const [isSavingAddress, setIsSavingAddress] = useState(false)

  const openAddressModal = (address: Address | null) => {
    setAddressForm(
      address
        ? {
            type: address.type,
            houseAddress: address.houseAddress ?? '',
            barangay: address.barangay ?? '',
            city: address.city ?? '',
            province: address.province ?? '',
            country: address.country ?? '',
            zipCode: address.zipCode ?? '',
          }
        : { type: 'City', houseAddress: '', barangay: '', city: '', province: '', country: '', zipCode: '' },
    )
    setAddressModal({ open: true, editing: address })
  }

  const handleSaveAddress = async () => {
    setIsSavingAddress(true)
    try {
      await personsApi.upsertAddress({
        id: addressModal.editing?.id,
        personId,
        ...addressForm,
      })
      addToast('success', addressModal.editing ? 'Address updated' : 'Address added', '')
      setAddressModal({ open: false, editing: null })
      await load()
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not save address.')
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await personsApi.deleteAddress(addressId)
      addToast('info', 'Address removed', '')
      await load()
    } catch (error) {
      addToast('error', 'Delete failed', error instanceof ApiError ? error.message : 'Could not delete address.')
    }
  }

  // --- Contacts ---
  const [contactModal, setContactModal] = useState<{ open: boolean; editing: Contact | null }>({ open: false, editing: null })
  const [contactForm, setContactForm] = useState({ contactType: '', value: '', isPrimary: false })
  const [isSavingContact, setIsSavingContact] = useState(false)

  const openContactModal = (contact: Contact | null) => {
    setContactForm(
      contact
        ? { contactType: contact.contactType ?? '', value: contact.value ?? '', isPrimary: contact.isPrimary ?? false }
        : { contactType: '', value: '', isPrimary: false },
    )
    setContactModal({ open: true, editing: contact })
  }

  const handleSaveContact = async () => {
    setIsSavingContact(true)
    try {
      await personsApi.upsertContact({ id: contactModal.editing?.id, personId, ...contactForm })
      addToast('success', contactModal.editing ? 'Contact updated' : 'Contact added', '')
      setContactModal({ open: false, editing: null })
      await load()
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not save contact.')
    } finally {
      setIsSavingContact(false)
    }
  }

  const handleDeleteContact = async (contactId: number) => {
    try {
      await personsApi.deleteContact(contactId)
      addToast('info', 'Contact removed', '')
      await load()
    } catch (error) {
      addToast('error', 'Delete failed', error instanceof ApiError ? error.message : 'Could not delete contact.')
    }
  }

  // --- Relationships ---
  const [relationshipModal, setRelationshipModal] = useState(false)
  const [relationshipForm, setRelationshipForm] = useState({
    relationshipType: '',
    isPrimary: false,
    isEmergencyContact: false,
    showOnTranscript: false,
  })
  const [relatedSearch, setRelatedSearch] = useState('')
  const [relatedResults, setRelatedResults] = useState<Array<{ id: number; label: string }>>([])
  const [selectedRelatedId, setSelectedRelatedId] = useState<number | null>(null)
  const [isSearchingRelated, setIsSearchingRelated] = useState(false)
  const [isSavingRelationship, setIsSavingRelationship] = useState(false)

  const openRelationshipModal = () => {
    setRelationshipForm({ relationshipType: '', isPrimary: false, isEmergencyContact: false, showOnTranscript: false })
    setRelatedSearch('')
    setRelatedResults([])
    setSelectedRelatedId(null)
    setRelationshipModal(true)
  }

  const handleSearchRelated = async () => {
    if (!relatedSearch.trim()) return
    setIsSearchingRelated(true)
    try {
      const results = await personsApi.list({ search: relatedSearch.trim() })
      setRelatedResults(
        results.filter((r) => r.id !== personId).map((r) => ({ id: r.id, label: `${formatPersonName(r)} (${r.idNumber})` })),
      )
    } catch {
      setRelatedResults([])
    } finally {
      setIsSearchingRelated(false)
    }
  }

  const handleSaveRelationship = async () => {
    if (!selectedRelatedId) {
      addToast('warning', 'Select a person', 'Search and select the related person first.')
      return
    }

    setIsSavingRelationship(true)
    try {
      await personsApi.upsertRelationship({
        fromPersonId: selectedRelatedId,
        toPersonId: personId,
        ...relationshipForm,
      })
      addToast('success', 'Relationship added', '')
      setRelationshipModal(false)
      await load()
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not save relationship.')
    } finally {
      setIsSavingRelationship(false)
    }
  }

  const handleDeleteRelationship = async (relationshipId: number) => {
    try {
      await personsApi.deleteRelationship(relationshipId)
      addToast('info', 'Relationship removed', '')
      await load()
    } catch (error) {
      addToast('error', 'Delete failed', error instanceof ApiError ? error.message : 'Could not delete relationship.')
    }
  }

  // --- Education history ---
  const [educationModal, setEducationModal] = useState<{ open: boolean; editing: EducationHistory | null }>({ open: false, editing: null })
  const [educationForm, setEducationForm] = useState({
    schoolId: 0,
    yearStarted: '',
    yearFinished: '',
    level: '',
    honors: '',
    gpa: '',
    lrnNumber: '',
  })
  const [schoolQuery, setSchoolQuery] = useState('')
  const [isSchoolSuggestionsOpen, setIsSchoolSuggestionsOpen] = useState(false)
  const [isSavingEducation, setIsSavingEducation] = useState(false)

  const schoolSuggestions = useMemo(() => {
    const query = schoolQuery.trim().toLowerCase()
    if (!query) return []
    return schools.filter((s) => (s.name ?? '').toLowerCase().includes(query)).slice(0, 8)
  }, [schoolQuery, schools])

  const openEducationModal = (history: EducationHistory | null) => {
    setEducationForm(
      history
        ? {
            schoolId: history.schoolId,
            yearStarted: history.yearStarted ?? '',
            yearFinished: history.yearFinished ?? '',
            level: history.level ?? '',
            honors: history.honors ?? '',
            gpa: history.gpa ?? '',
            lrnNumber: history.lrnNumber ?? '',
          }
        : { schoolId: 0, yearStarted: '', yearFinished: '', level: '', honors: '', gpa: '', lrnNumber: '' },
    )
    setSchoolQuery(history ? (schoolNameById.get(history.schoolId) ?? '') : '')
    setIsSchoolSuggestionsOpen(false)
    setEducationModal({ open: true, editing: history })
  }

  const selectSchoolSuggestion = (school: SchoolInfo) => {
    setEducationForm((current) => ({ ...current, schoolId: school.id }))
    setSchoolQuery(school.name ?? '')
    setIsSchoolSuggestionsOpen(false)
  }

  const sanitizeSchoolName = (raw: string) => {
    const collapsed = raw.trim().replace(/\s+/g, ' ')
    // Only title-case when the whole name was typed in lowercase, so
    // intentional casing (e.g. "STI College", "iAcademy") is left alone.
    if (collapsed !== collapsed.toLowerCase()) return collapsed
    return collapsed.replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const handleSaveEducation = async () => {
    const typedName = schoolQuery.trim()
    if (!typedName) {
      addToast('warning', 'School required', 'Enter or select a school for this education record.')
      return
    }

    setIsSavingEducation(true)
    try {
      let schoolId = educationForm.schoolId
      if (!schoolId) {
        const exactMatch = schools.find((s) => (s.name ?? '').toLowerCase() === typedName.toLowerCase())
        if (exactMatch) {
          schoolId = exactMatch.id
        } else {
          const created = await personLookupsApi.createSchool({ name: sanitizeSchoolName(typedName) })
          schoolId = created.id
          setSchools((current) => [...current, created])
        }
      }

      await personsApi.upsertEducationHistory({ id: educationModal.editing?.id, personId, ...educationForm, schoolId })
      addToast('success', educationModal.editing ? 'Education history updated' : 'Education history added', '')
      setEducationModal({ open: false, editing: null })
      await load()
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not save education history.')
    } finally {
      setIsSavingEducation(false)
    }
  }

  const handleDeleteEducation = async (historyId: number) => {
    try {
      await personsApi.deleteEducationHistory(historyId)
      addToast('info', 'Education history removed', '')
      await load()
    } catch (error) {
      addToast('error', 'Delete failed', error instanceof ApiError ? error.message : 'Could not delete education history.')
    }
  }

  // --- Sectoral identification ---
  const [sectoralModal, setSectoralModal] = useState<{ open: boolean; editing: SectoralIdentification | null }>({ open: false, editing: null })
  const [sectoralForm, setSectoralForm] = useState({ sectorType: '', sectorIdNumber: '' })
  const [isSavingSectoral, setIsSavingSectoral] = useState(false)

  const openSectoralModal = (identification: SectoralIdentification | null) => {
    setSectoralForm(
      identification
        ? { sectorType: identification.sectorType ?? '', sectorIdNumber: identification.sectorIdNumber ?? '' }
        : { sectorType: '', sectorIdNumber: '' },
    )
    setSectoralModal({ open: true, editing: identification })
  }

  const handleSaveSectoral = async () => {
    setIsSavingSectoral(true)
    try {
      await personsApi.upsertSectoralIdentification({ id: sectoralModal.editing?.id, personId, ...sectoralForm })
      addToast('success', sectoralModal.editing ? 'Sectoral ID updated' : 'Sectoral ID added', '')
      setSectoralModal({ open: false, editing: null })
      await load()
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not save sectoral identification.')
    } finally {
      setIsSavingSectoral(false)
    }
  }

  const handleDeleteSectoral = async (identificationId: number) => {
    try {
      await personsApi.deleteSectoralIdentification(identificationId)
      addToast('info', 'Sectoral ID removed', '')
      await load()
    } catch (error) {
      addToast('error', 'Delete failed', error instanceof ApiError ? error.message : 'Could not delete sectoral identification.')
    }
  }

  const schoolNameById = useMemo(() => new Map(schools.map((s) => [s.id, s.name ?? `School #${s.id}`])), [schools])

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner label="Loading person record" />
      </div>
    )
  }

  if (loadError || !person) {
    return (
      <Card className="p-8 text-center">
        <User className="mx-auto h-10 w-10 text-gh-fg-muted" aria-hidden="true" />
        <h3 className="mt-4 text-base font-semibold text-gh-fg">Unable to load record</h3>
        <p className="mt-2 text-sm text-gh-fg-muted">{loadError}</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate('/records')}>
          <ArrowLeft className="h-4 w-4" />
          Back to registration
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/records')}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-gh-fg">{formatPersonName(person)}</h2>
            <p className="text-xs font-mono text-gh-fg-muted">ID {person.idNumber}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {person.personTypes.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canUpdate && (
            <Button variant="outline" size="sm" onClick={openInfoModal}>
              <Pencil className="h-4 w-4" />
              Edit info
            </Button>
          )}
          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleDeletePerson()}
              className="text-gh-danger hover:bg-gh-danger-subtle"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <SectionCard
        icon={User}
        title="Basic information"
        action={
          canUpdate && (
            <Button variant="ghost" size="sm" onClick={openTypesModal}>
              Manage types
            </Button>
          )
        }
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Title</dt>
            <dd className="text-gh-fg">{person.title || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Gender</dt>
            <dd className="text-gh-fg">{person.gender || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Sex</dt>
            <dd className="text-gh-fg">{person.sex || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Civil status</dt>
            <dd className="text-gh-fg">{person.civilStatus || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Nationality</dt>
            <dd className="text-gh-fg">{person.nationality || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Religion</dt>
            <dd className="text-gh-fg">{person.religion || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Birth date</dt>
            <dd className="text-gh-fg">{person.birthDate || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Birth place</dt>
            <dd className="text-gh-fg">{person.birthPlace || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gh-fg-subtle">Occupation</dt>
            <dd className="text-gh-fg">{person.occupation || '—'}</dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard
        icon={MapPin}
        title="Addresses"
        action={canUpdate && <Button size="sm" variant="ghost" onClick={() => openAddressModal(null)}><Plus className="h-4 w-4" />Add</Button>}
      >
        {person.addresses.length === 0 ? (
          <p className="text-sm text-gh-fg-muted">No addresses on file.</p>
        ) : (
          <ul className="space-y-2">
            {person.addresses.map((address) => (
              <li key={address.id} className="flex items-center justify-between rounded-lg border border-gh-border px-4 py-3">
                <div>
                  <Badge variant="outline" className="mb-1">{address.type}</Badge>
                  <p className="text-sm text-gh-fg">
                    {[address.houseAddress, address.barangay, address.city, address.province, address.country, address.zipCode]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </p>
                </div>
                <RowActions onEdit={() => openAddressModal(address)} onDelete={() => void handleDeleteAddress(address.id)} canUpdate={canUpdate} canDelete={canDelete} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        icon={ContactIcon}
        title="Contacts"
        action={canUpdate && <Button size="sm" variant="ghost" onClick={() => openContactModal(null)}><Plus className="h-4 w-4" />Add</Button>}
      >
        {person.contacts.length === 0 ? (
          <p className="text-sm text-gh-fg-muted">No contacts on file.</p>
        ) : (
          <ul className="space-y-2">
            {person.contacts.map((contact) => (
              <li key={contact.id} className="flex items-center justify-between rounded-lg border border-gh-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{contact.contactType || '—'}</Badge>
                  <span className="text-sm text-gh-fg">{contact.value || '—'}</span>
                  {contact.isPrimary && <Badge variant="success">Primary</Badge>}
                </div>
                <RowActions onEdit={() => openContactModal(contact)} onDelete={() => void handleDeleteContact(contact.id)} canUpdate={canUpdate} canDelete={canDelete} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        icon={HeartHandshake}
        title="Relationships"
        description="Parents, guardians, and other linked persons."
        action={canUpdate && <Button size="sm" variant="ghost" onClick={openRelationshipModal}><Plus className="h-4 w-4" />Add</Button>}
      >
        {person.relationships.length === 0 ? (
          <p className="text-sm text-gh-fg-muted">No relationships on file.</p>
        ) : (
          <ul className="space-y-2">
            {person.relationships.map((relationship) => {
              const otherId = relationship.fromPersonId === person.id ? relationship.toPersonId : relationship.fromPersonId
              return (
                <li key={relationship.id} className="flex items-center justify-between rounded-lg border border-gh-border px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{relationship.relationshipType || '—'}</Badge>
                    <span className="text-sm font-medium text-gh-fg">{relatedNames[otherId] ?? `Person #${otherId}`}</span>
                    {relationship.isPrimary && <Badge variant="info">Primary</Badge>}
                    {relationship.isEmergencyContact && <Badge variant="warning">Emergency contact</Badge>}
                    {relationship.showOnTranscript && <Badge variant="default">On transcript</Badge>}
                  </div>
                  <RowActions onDelete={() => void handleDeleteRelationship(relationship.id)} canUpdate={canUpdate} canDelete={canDelete} />
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        icon={GraduationCap}
        title="Education history"
        action={
          canUpdate && (
            <Button size="sm" variant="ghost" onClick={() => openEducationModal(null)}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )
        }
      >
        {person.educationHistory.length === 0 ? (
          <p className="text-sm text-gh-fg-muted">No education history on file.</p>
        ) : (
          <ul className="space-y-2">
            {person.educationHistory.map((history) => (
              <li key={history.id} className="flex items-center justify-between rounded-lg border border-gh-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gh-fg">{schoolNameById.get(history.schoolId) ?? `School #${history.schoolId}`}</p>
                  <p className="text-xs text-gh-fg-muted">
                    {[history.level, [history.yearStarted, history.yearFinished].filter(Boolean).join(' – '), history.honors]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </p>
                </div>
                <RowActions onEdit={() => openEducationModal(history)} onDelete={() => void handleDeleteEducation(history.id)} canUpdate={canUpdate} canDelete={canDelete} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        icon={Shield}
        title="Sectoral identification"
        action={canUpdate && <Button size="sm" variant="ghost" onClick={() => openSectoralModal(null)}><Plus className="h-4 w-4" />Add</Button>}
      >
        {person.sectoralIdentifications.length === 0 ? (
          <p className="text-sm text-gh-fg-muted">No sectoral identification on file.</p>
        ) : (
          <ul className="space-y-2">
            {person.sectoralIdentifications.map((identification) => (
              <li key={identification.id} className="flex items-center justify-between rounded-lg border border-gh-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{identification.sectorType || '—'}</Badge>
                  <span className="text-sm text-gh-fg">{identification.sectorIdNumber || '—'}</span>
                </div>
                <RowActions onEdit={() => openSectoralModal(identification)} onDelete={() => void handleDeleteSectoral(identification.id)} canUpdate={canUpdate} canDelete={canDelete} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Basic info modal */}
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Edit basic information"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsInfoModalOpen(false)} disabled={isSavingInfo}>Cancel</Button>
            <Button onClick={() => void handleSaveInfo()} loading={isSavingInfo}>Save changes</Button>
          </>
        }
      >
        {infoForm && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="First name" value={infoForm.firstName} onChange={(e) => setInfoForm({ ...infoForm, firstName: e.target.value })} />
              <Input label="Middle name" value={infoForm.middleName} onChange={(e) => setInfoForm({ ...infoForm, middleName: e.target.value })} />
              <Input label="Last name" value={infoForm.lastName} onChange={(e) => setInfoForm({ ...infoForm, lastName: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Suffix" value={infoForm.suffixName ?? ''} onChange={(e) => setInfoForm({ ...infoForm, suffixName: e.target.value })} />
              <Input label="Title" value={infoForm.title ?? ''} onChange={(e) => setInfoForm({ ...infoForm, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gh-fg">Gender</label>
                <select className={selectClassName()} value={infoForm.gender} onChange={(e) => setInfoForm({ ...infoForm, gender: e.target.value })}>
                  <option value="">Select...</option>
                  {GENDER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gh-fg">Sex</label>
                <select className={selectClassName()} value={infoForm.sex} onChange={(e) => setInfoForm({ ...infoForm, sex: e.target.value })}>
                  <option value="">Select...</option>
                  {SEX_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gh-fg">Civil status</label>
                <select className={selectClassName()} value={infoForm.civilStatus ?? ''} onChange={(e) => setInfoForm({ ...infoForm, civilStatus: e.target.value })}>
                  <option value="">Select...</option>
                  {CIVIL_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Religion" value={infoForm.religion} onChange={(e) => setInfoForm({ ...infoForm, religion: e.target.value })} />
              <Input label="Nationality" value={infoForm.nationality ?? ''} onChange={(e) => setInfoForm({ ...infoForm, nationality: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Birth date" type="date" value={infoForm.birthDate ?? ''} onChange={(e) => setInfoForm({ ...infoForm, birthDate: e.target.value })} />
              <Input label="Birth place" value={infoForm.birthPlace ?? ''} onChange={(e) => setInfoForm({ ...infoForm, birthPlace: e.target.value })} />
            </div>
            <Input label="Occupation" value={infoForm.occupation} onChange={(e) => setInfoForm({ ...infoForm, occupation: e.target.value })} />
          </div>
        )}
      </Modal>

      {/* Person types modal */}
      <Modal
        isOpen={isTypesModalOpen}
        onClose={() => setIsTypesModalOpen(false)}
        title="Manage person types"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsTypesModalOpen(false)} disabled={isSavingTypes}>Cancel</Button>
            <Button onClick={() => void handleSaveTypes()} loading={isSavingTypes}>Save</Button>
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {personTypeOptions.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() =>
                setSelectedTypeIds((current) =>
                  current.includes(type.id) ? current.filter((id) => id !== type.id) : [...current, type.id],
                )
              }
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                selectedTypeIds.includes(type.id)
                  ? 'border-gh-accent/40 bg-gh-accent/8 text-gh-accent ring-1 ring-gh-accent/20'
                  : 'border-gh-border text-gh-fg-muted hover:bg-gh-canvas-subtle',
              )}
            >
              {type.name}
            </button>
          ))}
        </div>
      </Modal>

      {/* Address modal */}
      <Modal
        isOpen={addressModal.open}
        onClose={() => setAddressModal({ open: false, editing: null })}
        title={addressModal.editing ? 'Edit address' : 'Add address'}
        footer={
          <>
            <Button variant="outline" onClick={() => setAddressModal({ open: false, editing: null })} disabled={isSavingAddress}>Cancel</Button>
            <Button onClick={() => void handleSaveAddress()} loading={isSavingAddress}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gh-fg">Type</label>
            <select className={selectClassName()} value={addressForm.type} onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}>
              {ADDRESS_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <Input label="House / building / street" value={addressForm.houseAddress} onChange={(e) => setAddressForm({ ...addressForm, houseAddress: e.target.value })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Barangay" value={addressForm.barangay} onChange={(e) => setAddressForm({ ...addressForm, barangay: e.target.value })} />
            <Input label="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Province" value={addressForm.province} onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })} />
            <Input label="Country" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} />
          </div>
          <Input label="Zip code" value={addressForm.zipCode} onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })} />
        </div>
      </Modal>

      {/* Contact modal */}
      <Modal
        isOpen={contactModal.open}
        onClose={() => setContactModal({ open: false, editing: null })}
        title={contactModal.editing ? 'Edit contact' : 'Add contact'}
        footer={
          <>
            <Button variant="outline" onClick={() => setContactModal({ open: false, editing: null })} disabled={isSavingContact}>Cancel</Button>
            <Button onClick={() => void handleSaveContact()} loading={isSavingContact}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gh-fg">Contact type</label>
            <select className={selectClassName()} value={contactForm.contactType} onChange={(e) => setContactForm({ ...contactForm, contactType: e.target.value })}>
              <option value="">Select...</option>
              {contactTypeOptions.map((o) => <option key={o.id} value={o.name ?? ''}>{o.name}</option>)}
            </select>
          </div>
          <Input label="Value" value={contactForm.value} onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-gh-fg">
            <input type="checkbox" checked={contactForm.isPrimary} onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })} />
            Primary contact
          </label>
        </div>
      </Modal>

      {/* Relationship modal */}
      <Modal
        isOpen={relationshipModal}
        onClose={() => setRelationshipModal(false)}
        title="Add relationship"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setRelationshipModal(false)} disabled={isSavingRelationship}>Cancel</Button>
            <Button onClick={() => void handleSaveRelationship()} loading={isSavingRelationship}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <Input
              label="Search related person"
              value={relatedSearch}
              onChange={(e) => setRelatedSearch(e.target.value)}
              placeholder="Name or ID number"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && void handleSearchRelated()}
            />
            <Button variant="outline" onClick={() => void handleSearchRelated()} loading={isSearchingRelated}>Search</Button>
          </div>
          {relatedResults.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-gh-border">
              {relatedResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => setSelectedRelatedId(result.id)}
                  className={cn(
                    'block w-full px-3 py-2 text-left text-sm transition-colors',
                    selectedRelatedId === result.id ? 'bg-gh-accent/10 text-gh-accent' : 'hover:bg-gh-canvas-subtle',
                  )}
                >
                  {result.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gh-fg">Relationship type</label>
            <select
              className={selectClassName()}
              value={relationshipForm.relationshipType}
              onChange={(e) => setRelationshipForm({ ...relationshipForm, relationshipType: e.target.value })}
            >
              <option value="">Select...</option>
              {relationshipTypeOptions.map((o) => <option key={o.id} value={o.name ?? ''}>{o.name}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gh-fg">
              <input type="checkbox" checked={relationshipForm.isPrimary} onChange={(e) => setRelationshipForm({ ...relationshipForm, isPrimary: e.target.checked })} />
              Primary
            </label>
            <label className="flex items-center gap-2 text-sm text-gh-fg">
              <input type="checkbox" checked={relationshipForm.isEmergencyContact} onChange={(e) => setRelationshipForm({ ...relationshipForm, isEmergencyContact: e.target.checked })} />
              Emergency contact
            </label>
            <label className="flex items-center gap-2 text-sm text-gh-fg">
              <input type="checkbox" checked={relationshipForm.showOnTranscript} onChange={(e) => setRelationshipForm({ ...relationshipForm, showOnTranscript: e.target.checked })} />
              Show on transcript
            </label>
          </div>
        </div>
      </Modal>

      {/* Education history modal */}
      <Modal
        isOpen={educationModal.open}
        onClose={() => setEducationModal({ open: false, editing: null })}
        title={educationModal.editing ? 'Edit education history' : 'Add education history'}
        footer={
          <>
            <Button variant="outline" onClick={() => setEducationModal({ open: false, editing: null })} disabled={isSavingEducation}>Cancel</Button>
            <Button onClick={() => void handleSaveEducation()} loading={isSavingEducation}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="relative flex flex-col gap-1.5">
            <Input
              label="School"
              value={schoolQuery}
              onChange={(e) => {
                setSchoolQuery(e.target.value)
                setEducationForm((current) => ({ ...current, schoolId: 0 }))
                setIsSchoolSuggestionsOpen(true)
              }}
              onFocus={() => setIsSchoolSuggestionsOpen(true)}
              onBlur={() => setTimeout(() => setIsSchoolSuggestionsOpen(false), 150)}
              placeholder="Type to search, or enter a new school name"
              hint={
                educationForm.schoolId
                  ? undefined
                  : "Not in our records? Just type the full name — it'll be added when you save."
              }
              autoComplete="off"
            />
            {isSchoolSuggestionsOpen && schoolSuggestions.length > 0 && (
              <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gh-border bg-gh-canvas shadow-lg">
                {schoolSuggestions.map((school) => (
                  <button
                    key={school.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSchoolSuggestion(school)}
                    className="block w-full px-3 py-2 text-left text-sm text-gh-fg transition-colors hover:bg-gh-canvas-subtle"
                  >
                    {school.name}
                    {(school.city || school.province) && (
                      <span className="ml-1 text-xs text-gh-fg-subtle">
                        ({[school.city, school.province].filter(Boolean).join(', ')})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gh-fg">Level</label>
            <select className={selectClassName()} value={educationForm.level} onChange={(e) => setEducationForm({ ...educationForm, level: e.target.value })}>
              <option value="">Select...</option>
              {educationLevelOptions.map((o) => <option key={o.id} value={o.name ?? ''}>{o.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Year started" value={educationForm.yearStarted} onChange={(e) => setEducationForm({ ...educationForm, yearStarted: e.target.value })} placeholder="2022" />
            <Input label="Year finished" value={educationForm.yearFinished} onChange={(e) => setEducationForm({ ...educationForm, yearFinished: e.target.value })} placeholder="2026" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Honors" value={educationForm.honors} onChange={(e) => setEducationForm({ ...educationForm, honors: e.target.value })} />
            <Input label="GPA" value={educationForm.gpa} onChange={(e) => setEducationForm({ ...educationForm, gpa: e.target.value })} />
          </div>
          <Input label="LRN number" value={educationForm.lrnNumber} onChange={(e) => setEducationForm({ ...educationForm, lrnNumber: e.target.value })} />
        </div>
      </Modal>

      {/* Sectoral identification modal */}
      <Modal
        isOpen={sectoralModal.open}
        onClose={() => setSectoralModal({ open: false, editing: null })}
        title={sectoralModal.editing ? 'Edit sectoral identification' : 'Add sectoral identification'}
        footer={
          <>
            <Button variant="outline" onClick={() => setSectoralModal({ open: false, editing: null })} disabled={isSavingSectoral}>Cancel</Button>
            <Button onClick={() => void handleSaveSectoral()} loading={isSavingSectoral}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gh-fg">Sector type</label>
            <select className={selectClassName()} value={sectoralForm.sectorType} onChange={(e) => setSectoralForm({ ...sectoralForm, sectorType: e.target.value })}>
              <option value="">Select...</option>
              {sectorTypeOptions.map((o) => <option key={o.id} value={o.name ?? ''}>{o.name}</option>)}
            </select>
          </div>
          <Input label="Sector ID number" value={sectoralForm.sectorIdNumber} onChange={(e) => setSectoralForm({ ...sectoralForm, sectorIdNumber: e.target.value })} />
        </div>
      </Modal>
    </div>
  )
}
