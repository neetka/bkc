import { Bulletin } from '@/data/bulletins';

interface BulletinCardProps {
  bulletin: Bulletin;
}

export default function BulletinCard({ bulletin }: BulletinCardProps) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      {bulletin.isNew && (
        <span className="bg-red-500 text-white px-2 py-1 text-xs rounded">NEW</span>
      )}
      <h4 className="font-semibold">{bulletin.title}</h4>
      <p className="text-sm text-gray-600">{bulletin.description}</p>
      <p className="text-xs text-gray-500 mt-2">{new Date(bulletin.date).toLocaleDateString()}</p>
    </div>
  );
}