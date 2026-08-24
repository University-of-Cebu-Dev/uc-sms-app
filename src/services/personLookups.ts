import { apiRequest } from '@/lib/api'

export type PersonLookupType =
  | 'PersonType'
  | 'RelationshipType'
  | 'ContactType'
  | 'SectorType'
  | 'EducationLevel'

export interface LookupItem {
  id: number
  name: string | null
  code: string | null
}

export interface SchoolInfo {
  id: number
  name: string | null
  type: string | null
  schoolAddress: string | null
  barangay: string | null
  city: string | null
  province: string | null
  country: string | null
  contactNumber: string | null
  email: string | null
}

export interface SchoolInfoPayload {
  name: string
  type?: string | null
  schoolAddress?: string | null
  barangay?: string | null
  city?: string | null
  province?: string | null
  country?: string | null
  contactNumber?: string | null
  email?: string | null
}

export const personLookupsApi = {
  list(type: PersonLookupType) {
    return apiRequest<LookupItem[]>(`/person-lookups/${type}`)
  },

  create(type: PersonLookupType, name: string, code?: string | null) {
    return apiRequest<LookupItem>(`/person-lookups/${type}`, {
      method: 'POST',
      body: { name, code },
    })
  },

  update(type: PersonLookupType, id: number, name: string, code?: string | null) {
    return apiRequest<LookupItem>(`/person-lookups/${type}/${id}`, {
      method: 'PUT',
      body: { name, code },
    })
  },

  remove(type: PersonLookupType, id: number) {
    return apiRequest<void>(`/person-lookups/${type}/${id}`, { method: 'DELETE' })
  },

  listSchools() {
    return apiRequest<SchoolInfo[]>('/person-lookups/schools')
  },

  createSchool(payload: SchoolInfoPayload) {
    return apiRequest<SchoolInfo>('/person-lookups/schools', {
      method: 'POST',
      body: payload,
    })
  },

  updateSchool(id: number, payload: SchoolInfoPayload) {
    return apiRequest<SchoolInfo>(`/person-lookups/schools/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },

  removeSchool(id: number) {
    return apiRequest<void>(`/person-lookups/schools/${id}`, { method: 'DELETE' })
  },
}
