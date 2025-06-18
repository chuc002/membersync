export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          MemberSync Test Page
        </h1>
        <div className="space-y-4">
          <div className="p-4 bg-green-100 border border-green-300 rounded-md">
            <p className="text-green-800 font-semibold">✅ Server Running</p>
            <p className="text-green-700 text-sm">Next.js development server is working properly</p>
          </div>
          <div className="p-4 bg-blue-100 border border-blue-300 rounded-md">
            <p className="text-blue-800 font-semibold">✅ TypeScript Active</p>
            <p className="text-blue-700 text-sm">TypeScript compilation successful</p>
          </div>
          <div className="p-4 bg-purple-100 border border-purple-300 rounded-md">
            <p className="text-purple-800 font-semibold">✅ Tailwind CSS Working</p>
            <p className="text-purple-700 text-sm">Styles are loading correctly</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">Port: 3001</p>
          <p className="text-gray-600 text-sm">Ready for club event management development</p>
        </div>
      </div>
    </div>
  );
}