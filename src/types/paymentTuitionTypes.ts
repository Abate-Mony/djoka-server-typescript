export interface PaymentTuitionData {
  academicYear: string;
  studentName: string;
  matricule: string;
  studentClass: string;
  installment: number;
  paymentMethod: string;
  additionalNotes?: string;
}
