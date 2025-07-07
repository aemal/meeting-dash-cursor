'use client'

import { useState, useEffect } from 'react'
import { MeetingsTable } from '@/components/MeetingsTable'
import { PageHeader } from '@/components/PageHeader'
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerButton, DrawerCancelButton, DrawerSaveButton } from '@/components/Drawer'
import { getAllMeetings } from '@/lib/meetings'
import type { Meeting } from '@/types/meeting'

export default function Home() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | 'create'>('view')

  // Fetch meetings on component mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const fetchedMeetings = await getAllMeetings()
        setMeetings(fetchedMeetings)
      } catch (err) {
        console.error('Failed to fetch meetings:', err)
        setError('Failed to load meetings. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  // Handle meeting click - open drawer with meeting details
  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setDrawerMode('view')
    setIsDrawerOpen(true)
  }

  // Handle add meeting click - open drawer for creating new meeting
  const handleAddMeeting = () => {
    setSelectedMeeting(null)
    setDrawerMode('create')
    setIsDrawerOpen(true)
  }

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSelectedMeeting(null)
  }

  // Handle save action (placeholder)
  const handleSave = () => {
    console.log('Save clicked for mode:', drawerMode)
    // TODO: Implement save functionality in future tasks
    setIsDrawerOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader onAddMeeting={handleAddMeeting} />
        
        <div className="mt-8">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <MeetingsTable 
              meetings={meetings}
              onMeetingClick={handleMeetingClick}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Drawer for viewing/editing/creating meeting minutes */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        title={
          drawerMode === 'create' 
            ? 'Add New Meeting Minutes'
            : drawerMode === 'edit'
            ? 'Edit Meeting Minutes'
            : selectedMeeting?.title || 'Meeting Details'
        }
        size="lg"
      >
        <DrawerBody>
          {drawerMode === 'create' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meeting title..."
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Time
                </label>
                <input
                  type="datetime-local"
                  id="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Minutes
                </label>
                <textarea
                  id="content"
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meeting minutes in Markdown format..."
                />
              </div>
            </div>
          )}
          
          {drawerMode === 'view' && selectedMeeting && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Meeting Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Time:</strong> {new Date(selectedMeeting.time).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Last Updated:</strong> {new Date(selectedMeeting.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Meeting Minutes</h4>
                <div className="prose prose-sm max-w-none bg-white p-4 border border-gray-200 rounded-md">
                  {selectedMeeting.content ? (
                    <pre className="whitespace-pre-wrap font-sans">{selectedMeeting.content}</pre>
                  ) : (
                    <p className="text-gray-500 italic">No content available</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {drawerMode === 'edit' && selectedMeeting && (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  id="edit-title"
                  defaultValue={selectedMeeting.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-time" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Time
                </label>
                <input
                  type="datetime-local"
                  id="edit-time"
                  defaultValue={selectedMeeting.time}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Minutes
                </label>
                <textarea
                  id="edit-content"
                  rows={10}
                  defaultValue={selectedMeeting.content || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter>
          {drawerMode === 'view' ? (
            <>
              <DrawerCancelButton onCancel={handleDrawerClose} />
              <DrawerButton
                variant="primary"
                onClick={() => setDrawerMode('edit')}
              >
                Edit
              </DrawerButton>
            </>
          ) : (
            <>
              <DrawerCancelButton onCancel={handleDrawerClose} />
              <DrawerSaveButton onSave={handleSave} />
            </>
          )}
        </DrawerFooter>
      </Drawer>
    </div>
  )
} 