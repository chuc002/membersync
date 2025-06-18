export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MemberSync Dashboard</h1>
          <p className="text-lg text-gray-600">Club Event Management System</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-3xl font-bold text-blue-600">247</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clubs</p>
                <p className="text-3xl font-bold text-purple-600">8</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-orange-600">89%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Chess Tournament</h3>
                  <p className="text-sm text-gray-600">Chess Club • Tomorrow, 2:00 PM</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">45 registered</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Photography Workshop</h3>
                  <p className="text-sm text-gray-600">Photo Club • Dec 22, 10:00 AM</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">23 registered</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Debate Championship</h3>
                  <p className="text-sm text-gray-600">Debate Club • Dec 25, 6:00 PM</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">32 registered</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Club Activities</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">SC</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Science Club</h3>
                    <p className="text-sm text-gray-600">62 members • 3 events this month</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">AC</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Art Club</h3>
                    <p className="text-sm text-gray-600">38 members • 2 events this month</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">MC</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Music Club</h3>
                    <p className="text-sm text-gray-600">54 members • 1 event this month</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Planning</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors">
              <span>➕</span>
              <span>Add Member</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors">
              <span>📅</span>
              <span>Create Event</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors">
              <span>🏢</span>
              <span>Manage Clubs</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors">
              <span>📊</span>
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
