'use client'

import { useState } from 'react'
import { IHCCEventImporter } from '@/lib/csvImporter'
import type { MockEvent } from '@/lib/mock/data'

interface CSVImporterProps {
  onEventsImported: (events: MockEvent[]) => void
  onClose: () => void
}

export default function CSVImporter({ onEventsImported, onClose }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<MockEvent[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Generate preview from file
    try {
      const events = await IHCCEventImporter.processCSVFile(selectedFile)
      setPreview(events.slice(0, 10)) // Show first 10 events as preview
      
      // Calculate category stats
      const categoryStats: Record<string, number> = {}
      events.forEach(event => {
        categoryStats[event.category] = (categoryStats[event.category] || 0) + 1
      })
      setStats(categoryStats)
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error reading CSV file. Please check the format.')
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    try {
      const events = await IHCCEventImporter.processCSVFile(file)
      onEventsImported(events)
      alert(`Successfully imported ${events.length} IHCC events!`)
      onClose()
    } catch (error) {
      console.error('Import error:', error)
      alert('Error importing events. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Import IHCC Events from CSV</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload your IHCC events CSV file. Expected format: Subject, Start Date, Start Time, End Date, End Time, Description, Location
              </p>
            </div>
          </div>

          {/* Category Statistics */}
          {Object.keys(stats).length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Event Categories Distribution</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(stats).map(([category, count]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                    <div className="text-sm text-gray-700">{category}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Total events: {Object.values(stats).reduce((sum, count) => sum + count, 0)}
              </div>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Preview (First 10 Events)</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Title</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Date</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Time</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Category</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-900">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((event, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-gray-900 max-w-xs truncate">
                            {event.title}
                          </td>
                          <td className="px-4 py-2 text-gray-600">{event.date}</td>
                          <td className="px-4 py-2 text-gray-600">{event.time}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              event.category === 'Fitness' ? 'bg-green-100 text-green-800' :
                              event.category === 'Kids' ? 'bg-blue-100 text-blue-800' :
                              event.category === 'Golf' ? 'bg-yellow-100 text-yellow-800' :
                              event.category === 'Dining' ? 'bg-purple-100 text-purple-800' :
                              'bg-pink-100 text-pink-800'
                            }`}>
                              {event.category}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600">${event.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Categorization Info */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Automatic Categorization</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>Fitness:</strong> WoW, cardio, sculpt, barre, aqua, training, conditioning, weights, yoga, pilates, clinic</div>
              <div><strong>Kids:</strong> Jr., junior, kids, children, son, daughter, youth, father-son, family activities</div>
              <div><strong>Golf:</strong> golf, tee, course, tournament, scramble, pro shop</div>
              <div><strong>Dining:</strong> dining, dinner, lunch, breakfast, wine, tasting, chef, menu, food, cuisine</div>
              <div><strong>Social:</strong> social, party, member, guest, celebration, entertainment, music, events</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {importing ? 'Importing...' : 'Import Events'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}