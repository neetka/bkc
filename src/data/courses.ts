export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  fee: string;
}

export const courses: Course[] = [
  {
    id: 'basic-computer',
    title: 'Basic Computer Literacy',
    description: 'Learn fundamentals of computer usage, internet, and basic software.',
    duration: '1 month',
    fee: '₹2000',
  },
  {
    id: 'ms-office',
    title: 'MS Office Suite',
    description: 'Training in Word, Excel, PowerPoint.',
    duration: '2 months',
    fee: '₹3000',
  },
  {
    id: 'typing',
    title: 'Typing Skills',
    description: 'Improve typing speed and accuracy.',
    duration: '1 month',
    fee: '₹1500',
  },
];