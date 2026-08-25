import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, RefreshCw, School as SchoolIcon, Trash2 } from 'lucide-react'
import { personLookupsApi, type SchoolInfo, type SchoolInfoPayload } from '@/services/personLookups'
import { useToast } from '@/hooks/useToast'
import { ApiError } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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

const SCHOOL_TYPE_OPTIONS = ['Public', 'Private']

const emptyForm: SchoolInfoPayload = {
  name: '',
  type: '',
  schoolAddress: '',
  barangay: '',
  city: '',
  province: '',
  country: '',
  contactNumber: '',
  email: '',
}

export function SchoolsPanel() {
  const { addToast } = useToast()
  const [schools, setSchools] = useState<SchoolInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [modal, setModal] = useState<{ open: boolean; editing: SchoolInfo | null }>({ open: false, editing: null })
  const [form, setForm] = useState<SchoolInfoPayload>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await personLookupsApi.listSchools()
      setSchools(data)
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 403
          ? "You don't have permission to manage schools."
          : error instanceof ApiError
            ? error.message
            : 'Could not load schools.'
      setLoadError(message)
      setSchools([])
      addToast('error', 'Load failed', message)
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    void load()
  }, [load])

  const openCreateModal = () => {
    setForm(emptyForm)
    setModal({ open: true, editing: null })
  }

  const openEditModal = (school: SchoolInfo) => {
    setForm({
      name: school.name ?? '',
      type: school.type ?? '',
      schoolAddress: school.schoolAddress ?? '',
      barangay: school.barangay ?? '',
      city: school.city ?? '',
      province: school.province ?? '',
      country: school.country ?? '',
      contactNumber: school.contactNumber ?? '',
      email: school.email ?? '',
    })
    setModal({ open: true, editing: school })
  }

  const closeModal = () => {
    setModal({ open: false, editing: null })
    setForm(emptyForm)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      addToast('warning', 'Name required', 'Enter a name for this school.')
      return
    }

    setIsSaving(true)
    try {
      if (modal.editing) {
        await personLookupsApi.updateSchool(modal.editing.id, form)
        addToast('success', 'School updated', '')
      } else {
        await personLookupsApi.createSchool(form)
        addToast('success', 'School added', '')
      }
      closeModal()
      await load()
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not save this school.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (school: SchoolInfo) => {
    try {
      await personLookupsApi.removeSchool(school.id)
      addToast('info', 'School removed', '')
      await load()
    } catch (error) {
      addToast('error', 'Delete failed', error instanceof ApiError ? error.message : 'Could not delete this school.')
    }
  }

  return (
    <>
      <Card className="overflow-hidden !p-0">
        <div className="flex flex-col gap-3 border-b border-gh-border bg-gh-canvas-subtle/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gh-accent/10 text-gh-accent">
              <SchoolIcon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gh-fg">Schools</h3>
              <p className="text-xs text-gh-fg-muted">Schools referenced by education history records.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void load()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreateModal}>
              <Plus className="h-4 w-4" />
              Add school
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Spinner label="Loading" />
          </div>
        ) : loadError ? (
          <p className="px-4 py-8 text-center text-sm text-gh-fg-muted">{loadError}</p>
        ) : schools.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-gh-fg-muted">No schools yet. Add one to get started.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City / Province</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name ?? '—'}</TableCell>
                  <TableCell className="text-sm text-gh-fg-muted">{school.type ?? '—'}</TableCell>
                  <TableCell className="text-sm text-gh-fg-muted">
                    {[school.city, school.province].filter(Boolean).join(', ') || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(school)} aria-label={`Edit ${school.name}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleDelete(school)}
                        className="text-gh-danger hover:bg-gh-danger-subtle hover:text-gh-danger"
                        aria-label={`Delete ${school.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.editing ? 'Edit school' : 'Add school'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} loading={isSaving}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gh-fg">Type</label>
              <select
                value={form.type ?? ''}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                className="w-full rounded-md border border-gh-border bg-gh-canvas px-3 py-2 text-sm text-gh-fg focus:border-gh-accent focus:outline-none focus:ring-1 focus:ring-gh-accent"
              >
                <option value="">Select...</option>
                {SCHOOL_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="School address"
            value={form.schoolAddress ?? ''}
            onChange={(event) => setForm((current) => ({ ...current, schoolAddress: event.target.value }))}
            placeholder="Bldg / Unit #, Village/Subdivision, Street, Sitio"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Barangay"
              value={form.barangay ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, barangay: event.target.value }))}
            />
            <Input
              label="City"
              value={form.city ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Province"
              value={form.province ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, province: event.target.value }))}
            />
            <Input
              label="Country"
              value={form.country ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Contact number"
              value={form.contactNumber ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, contactNumber: event.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              value={form.email ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
