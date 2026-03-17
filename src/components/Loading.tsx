export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center text-gray-900">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">BK Computers</h1>
        <h2 className="text-2xl mb-8">CSC Baghpur</h2>
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}