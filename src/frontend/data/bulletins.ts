export interface Bulletin {
  id: string;
  title: string;
  description: string;
  date: string;
  isNew: boolean;
}

export const bulletins: Bulletin[] = [
  {
    id: 'new-service-1',
    title: 'Punjab ₹10 Lakh Health Card Scheme',
    description: 'Now offering registration for Mukh Mantri Sehat Yojana with cashless treatment up to ₹10 lakh per family.',
    date: '2024-03-14',
    isNew: true,
  },
  {
    id: 'new-service-2',
    title: 'New Aadhaar Update Service',
    description: 'We now offer Aadhaar biometric update services.',
    date: '2024-03-01',
    isNew: true,
  },
  {
    id: 'new-service-3',
    title: 'PAN Card Correction Service',
    description: 'Assistance for PAN card name/address corrections.',
    date: '2024-02-15',
    isNew: true,
  },
];