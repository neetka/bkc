import { Service } from '@/data/services';

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <div
      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-blue-200 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="text-4xl text-blue-600 mb-4 transform hover:scale-110 transition-transform duration-300">
        <i className={service.icon}></i>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
      <p className="text-gray-600 leading-relaxed">{service.description}</p>
    </div>
  );
}