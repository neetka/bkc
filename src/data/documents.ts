export interface DocumentItem {
  label: string;
  icon: string;
}

export interface RequiredDocument {
  serviceId: string;
  documents: DocumentItem[];
}

export const requiredDocuments: RequiredDocument[] = [
  {
    serviceId: 'pan-card',
    documents: [
      { label: 'Identity proof (Aadhaar, Voter ID)', icon: 'fas fa-id-card' },
      { label: 'Address proof', icon: 'fas fa-map-marker-alt' },
      { label: 'Date of birth proof', icon: 'fas fa-certificate' },
      { label: 'Photograph', icon: 'fas fa-camera' },
    ],
  },
  {
    serviceId: 'aadhaar-card',
    documents: [
      { label: 'Birth certificate', icon: 'fas fa-certificate' },
      { label: 'Identity proof of parents', icon: 'fas fa-id-card' },
      { label: 'Address proof', icon: 'fas fa-map-marker-alt' },
    ],
  },
  {
    serviceId: 'passport',
    documents: [
      { label: 'Birth certificate', icon: 'fas fa-certificate' },
      { label: 'Address proof', icon: 'fas fa-map-marker-alt' },
      { label: 'Photograph', icon: 'fas fa-camera' },
      { label: 'Identity proof', icon: 'fas fa-id-card' },
    ],
  },
  {
    serviceId: 'driving-licence',
    documents: [
      { label: 'Age proof', icon: 'fas fa-calendar-alt' },
      { label: 'Address proof', icon: 'fas fa-map-marker-alt' },
      { label: 'Medical certificate', icon: 'fas fa-file-medical' },
      { label: 'Photograph', icon: 'fas fa-camera' },
    ],
  },
];