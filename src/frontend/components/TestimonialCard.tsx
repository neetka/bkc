import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-yellow-400 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-600 mb-4">"{testimonial.message}"</p>
      <p className="font-semibold">- {testimonial.name}</p>
    </div>
  );
}