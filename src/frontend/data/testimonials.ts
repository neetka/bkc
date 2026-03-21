export interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    message: 'Excellent service for PAN card application. Very helpful staff.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    message: 'Learned computer skills here. Highly recommend for rural students.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Amit Singh',
    message: 'Got my Aadhaar card quickly. Professional and trustworthy.',
    rating: 4,
  },
];