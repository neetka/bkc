export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // icon name or class
  category: 'government' | 'other';
}

export const services: Service[] = [
  {
    id: 'gov-exam-form',
    title: 'Government Exam Form Filling',
    description: 'Assistance with filling government exam application forms.',
    icon: 'fas fa-file-alt',
    category: 'government',
  },
  {
    id: 'pan-card',
    title: 'PAN Card Application',
    description: 'Help with PAN card application and renewal.',
    icon: 'fas fa-id-card',
    category: 'government',
  },
  {
    id: 'aadhaar-card',
    title: 'Aadhaar Card Application',
    description: 'Services for new Aadhaar card applications.',
    icon: 'fas fa-address-card',
    category: 'government',
  },
  {
    id: 'aadhaar-amendment',
    title: 'Aadhaar Amendment/Correction',
    description: 'Update or correct Aadhaar card details.',
    icon: 'fas fa-edit',
    category: 'government',
  },
  {
    id: 'passport',
    title: 'Passport Services',
    description: 'Assistance with passport applications and renewals.',
    icon: 'fas fa-passport',
    category: 'government',
  },
  {
    id: 'driving-licence',
    title: 'Driving Licence Services',
    description: 'Help with driving licence applications.',
    icon: 'fas fa-car',
    category: 'government',
  },
  {
    id: 'csc-services',
    title: 'CSC-related Government Services',
    description: 'Various government services through Common Service Centre.',
    icon: 'fas fa-building',
    category: 'government',
  },
  {
    id: 'other-services',
    title: 'Other Online Public Services',
    description: 'Additional online public services and assistance.',
    icon: 'fas fa-globe',
    category: 'other',
  },
];