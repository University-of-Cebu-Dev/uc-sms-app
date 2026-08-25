import { useCallback, useEffect, useState } from 'react'
import { ListTree, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { personLookupsApi, type LookupItem, type PersonLookupType } from '@/services/personLookups'
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

interface LookupTablePanelProps {
  type: PersonLookupType
  label: string
  description: string
}

export function LookupTablePanel({ type, label, description }: LookupTablePanelProps) {
  const { addToast } = useToast()
  const [items, setItems] = useState<LookupItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [modal, setModal] = useState<{ open: boolean; editing: LookupItem | null }>({ open: false, editing: null })
  const [form, setForm] = useState({ name: '', code: '' })
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await personLookupsApi.list(type)
      setItems(data)
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 403
          ? "You don't have permission to manage lookup tables."
          : error instanceof ApiError
            ? error.message
            : 'Could not load this lookup table.'
      setLoadError(message)
      setItems([])
      addToast('error', 'Load failed', message)
    } finally {
      setIsLoading(false)
    }
  }, [type, addToast])

  useEffect(() => {
    void load()
  }, [load])

  const openCreateModal = () => {
    setForm({ name: '', code: '' })
    setModal({ open: true, editing: null })
  }

  const openEditModal = (item: LookupItem) => {
    setForm({ name: item.name ?? '', code: item.code ?? '' })
    setModal({ open: true, editing: item })
  }

  const closeModal = () => {
    setModal({ open: false, editing: null })
    setForm({ name: '', code: '' })
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      addToast('warning', 'Name required', 'Enter a name for this entry.')
      return
    }

    setIsSaving(true)
    try {
      if (modal.editing) {
        await personLookupsApi.update(type, modal.editing.id, form.name.trim(), form.code.trim() || null)
        addToast('success', 'Entry updated', '')
      } else {
        await personLookupsApi.create(type, form.name.trim(), form.code.trim() || null)
        addToast('success', 'Entry added', '')
      }
      closeModal()
      await load()
    } catch (error) {
      addToast('error', 'Save failed', error instanceof ApiError ? error.message : 'Could not save this entry.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (item: LookupItem) => {
    try {
      await personLookupsApi.remove(type, item.id)
      addToast('info', 'Entry removed', '')
      await load()
    } catch (error) {
      addToast('error', 'Delete failed', error instanceof ApiError ? error.message : 'Could not delete this entry.')
    }
  }

  return (
    <>
      <Card className="overflow-hidden !p-0">
        <div className="flex flex-col gap-3 border-b border-gh-border bg-gh-canvas-subtle/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gh-accent/10 text-gh-accent">
              <ListTree className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gh-fg">{label}</h3>
              <p className="text-xs text-gh-fg-muted">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void load()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreateModal}>
              <Plus className="h-4 w-4" />
              Add entry
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Spinner label="Loading" />
          </div>
        ) : loadError ? (
          <p className="px-4 py-8 text-center text-sm text-gh-fg-muted">{loadError}</p>
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-gh-fg-muted">No entries yet. Add one to get started.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name ?? '—'}</TableCell>
                  <TableCell className="font-mono text-xs text-gh-fg-muted">{item.code ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(item)} aria-label={`Edit ${item.name}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleDelete(item)}
                        className="text-gh-danger hover:bg-gh-danger-subtle hover:text-gh-danger"
                        aria-label={`Delete ${item.name}`}
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
        title={modal.editing ? `Edit ${label.replace(/s$/, '')}` : `Add ${label.replace(/s$/, '')}`}
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
          <Input
            label="Name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Input
            label="Code"
            value={form.code}
            onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
            hint="Optional. Used internally to reference this entry (e.g. STUDENT, MOBILE)."
          />
        </div>
      </Modal>
    </>
  )
}
