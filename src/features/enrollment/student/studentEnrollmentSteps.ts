export type EnrollmentFlowPhase = 'admission' | 'enrollment'

export interface StudentEnrollmentStep {
  id: number
  phase: EnrollmentFlowPhase
  title: string
  description: string
  note?: string
}

/** Steps from Admission + Enrollment flow (College / SHS — Freshmen, Transferees, Cross-Enrollees). */
export const studentEnrollmentSteps: StudentEnrollmentStep[] = [
  {
    id: 1,
    phase: 'admission',
    title: 'Online Registration',
    description:
      'Complete the enrollment form, upload documentary requirements, and save your tracking number.',
  },
  {
    id: 2,
    phase: 'admission',
    title: 'College / Department',
    description: 'Submit and fulfill departmental documentary requirements at your college or department.',
  },
  {
    id: 3,
    phase: 'admission',
    title: 'SAO / POD / Guidance',
    description:
      'Submit and fulfill Student Affairs, POD, and Guidance requirements.',
    note: 'Transferees',
  },
  {
    id: 4,
    phase: 'admission',
    title: 'Proceed to Enrollment',
    description:
      'After all requirements are fulfilled and approved, note your assigned section from the Dean or Principal and continue to enrollment.',
  },
  {
    id: 5,
    phase: 'enrollment',
    title: 'Payment',
    description: 'Process and settle payments online or at the campus cashier.',
  },
  {
    id: 6,
    phase: 'enrollment',
    title: 'Course / Class Schedule Selection',
    description: 'Select schedules to enroll, and submit your choices.',
    note: 'Irregular / non-blocked students',
  },
  {
    id: 7,
    phase: 'enrollment',
    title: 'Study Load Printing',
    description:
      'Print your study load, and submit the printed copy to the Registrar for validation.',
    note: 'If hard-copy study load is required',
  },
  {
    id: 8,
    phase: 'enrollment',
    title: 'Hard-copy requirements to Registrar',
    description: 'Submit complete hard-copy documentary requirements to the Registrar.',
  },
  {
    id: 9,
    phase: 'enrollment',
    title: 'ID Capture and Printing',
    description: 'Proceed to EDP for student ID capture and printing.',
  },
]

export const admissionPhaseLabel = 'Admission flow'
export const enrollmentPhaseLabel = 'Enrollment flow'
