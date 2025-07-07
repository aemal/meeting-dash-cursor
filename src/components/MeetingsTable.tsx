'use client'

import { useState } from 'react'
import type { Meeting } from '@/types/meeting'

interface MeetingsTableProps {
  meetings: Meeting[]
  onMeetingClick: (meeting: Meeting) => void
  isLoading?: boolean
}

export function MeetingsTable({ meetings, onMeetingClick, isLoading = false }: MeetingsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading meetings...</p>
        </div>
      </div>
    )
  }

  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No meetings yet</h3>
          <p className="text-gray-600">Get started by creating your first meeting minute.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Meeting Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Meeting Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {meetings.map((meeting) => (
              <tr
                key={meeting.id}
                onClick={() => onMeetingClick(meeting)}
                onMouseEnter={() => setHoveredRow(meeting.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`
                  cursor-pointer transition-colors duration-150 ease-in-out
                  ${hoveredRow === meeting.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  focus-within:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50
                `}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onMeetingClick(meeting)
                  }
                }}
                aria-label={`Open meeting: ${meeting.title}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {meeting.title}
                  </div>
                  {meeting.content && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {meeting.content.substring(0, 60)}
                      {meeting.content.length > 60 && '...'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(meeting.time)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(meeting.updated_at)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 