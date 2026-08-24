import { apiRequest } from '@/lib/api'

export interface PersonSummary {
  id: number
  idNumber: string
  firstName: string
  middleName: string
  lastName: string
  suffixName: string | null
  personTypes: string[]
}

export interface Address {
  id: number
  type: string
  houseAddress: string | null
  barangay: string | null
  city: string | null
  province: string | null
  country: string | null
  zipCode: string | null
}

export interface Contact {
  id: number
  contactType: string | null
  value: string | null
  isPrimary: boolean | null
}

export interface PersonRelationship {
  id: number
  fromPersonId: number
  toPersonId: number
  relationshipType: string | null
  isPrimary: boolean | null
  isEmergencyContact: boolean | null
  showOnTranscript: boolean | null
}

export interface EducationHistory {
  id: number
  schoolId: number
  yearStarted: string | null
  yearFinished: string | null
  level: string | null
  honors: string | null
  gpa: string | null
  lrnNumber: string | null
}

export interface SectoralIdentification {
  id: number
  sectorType: string | null
  sectorIdNumber: string | null
}

export interface PersonDetail extends PersonSummary {
  title: string | null
  religion: string
  gender: string
  sex: string
  nationality: string | null
  civilStatus: string | null
  birthDate: string | null
  birthPlace: string | null
  occupation: string
  addresses: Address[]
  contacts: Contact[]
  relationships: PersonRelationship[]
  educationHistory: EducationHistory[]
  sectoralIdentifications: SectoralIdentification[]
}

export interface CreatePersonPayload {
  id_number: string
  first_name: string
  last_name: string
  middle_name: string
  suffix: string
  title: string
  religion: string
  gender: string
  sex: string
  nationality: string
  civil_status: string
  birthdate: string
  birthplace: string
  occupation: string
}

export interface UpdatePersonPayload {
  firstName: string
  lastName: string
  middleName: string
  suffixName: string | null
  title: string | null
  religion: string
  gender: string
  sex: string
  nationality: string | null
  civilStatus: string | null
  birthDate: string | null
  birthPlace: string | null
  occupation: string
}

export interface AddressPayload {
  id?: number
  personId: number
  type: string
  houseAddress?: string | null
  barangay?: string | null
  city?: string | null
  province?: string | null
  country?: string | null
  zipCode?: string | null
}

export interface ContactPayload {
  id?: number
  personId: number
  contactType?: string | null
  value?: string | null
  isPrimary?: boolean | null
}

export interface PersonRelationshipPayload {
  id?: number
  fromPersonId: number
  toPersonId: number
  relationshipType?: string | null
  isPrimary?: boolean | null
  isEmergencyContact?: boolean | null
  showOnTranscript?: boolean | null
}

export interface EducationHistoryPayload {
  id?: number
  personId: number
  schoolId: number
  yearStarted?: string | null
  yearFinished?: string | null
  level?: string | null
  honors?: string | null
  gpa?: string | null
  lrnNumber?: string | null
}

export interface SectoralIdentificationPayload {
  id?: number
  personId: number
  sectorType?: string | null
  sectorIdNumber?: string | null
}

export function formatPersonName(person: Pick<PersonSummary, 'firstName' | 'middleName' | 'lastName' | 'suffixName'>) {
  return [person.firstName, person.middleName, person.lastName, person.suffixName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')
}

export const personsApi = {
  list(params?: { personTypeCode?: string; search?: string }) {
    const query = new URLSearchParams()
    if (params?.personTypeCode) query.set('personTypeCode', params.personTypeCode)
    if (params?.search) query.set('search', params.search)
    const qs = query.toString()
    return apiRequest<PersonSummary[]>(`/persons${qs ? `?${qs}` : ''}`)
  },

  getById(id: number) {
    return apiRequest<PersonDetail>(`/persons/${id}`)
  },

  create(payload: CreatePersonPayload) {
    return apiRequest<PersonDetail>('/persons', { method: 'POST', body: payload })
  },

  update(id: number, payload: UpdatePersonPayload) {
    return apiRequest<PersonDetail>(`/persons/${id}`, { method: 'PUT', body: payload })
  },

  remove(id: number) {
    return apiRequest<void>(`/persons/${id}`, { method: 'DELETE' })
  },

  assignTypes(id: number, personTypeIds: number[]) {
    return apiRequest<string[]>(`/persons/${id}/types`, {
      method: 'PUT',
      body: { personTypeIds },
    })
  },

  upsertAddress(payload: AddressPayload) {
    return apiRequest<Address>('/persons/addresses', { method: 'POST', body: payload })
  },

  deleteAddress(id: number) {
    return apiRequest<void>(`/persons/addresses/${id}`, { method: 'DELETE' })
  },

  upsertContact(payload: ContactPayload) {
    return apiRequest<Contact>('/persons/contacts', { method: 'POST', body: payload })
  },

  deleteContact(id: number) {
    return apiRequest<void>(`/persons/contacts/${id}`, { method: 'DELETE' })
  },

  upsertRelationship(payload: PersonRelationshipPayload) {
    return apiRequest<PersonRelationship>('/persons/relationships', { method: 'POST', body: payload })
  },

  deleteRelationship(id: number) {
    return apiRequest<void>(`/persons/relationships/${id}`, { method: 'DELETE' })
  },

  upsertEducationHistory(payload: EducationHistoryPayload) {
    return apiRequest<EducationHistory>('/persons/education-history', { method: 'POST', body: payload })
  },

  deleteEducationHistory(id: number) {
    return apiRequest<void>(`/persons/education-history/${id}`, { method: 'DELETE' })
  },

  upsertSectoralIdentification(payload: SectoralIdentificationPayload) {
    return apiRequest<SectoralIdentification>('/persons/sectoral-identifications', {
      method: 'POST',
      body: payload,
    })
  },

  deleteSectoralIdentification(id: number) {
    return apiRequest<void>(`/persons/sectoral-identifications/${id}`, { method: 'DELETE' })
  },
}
