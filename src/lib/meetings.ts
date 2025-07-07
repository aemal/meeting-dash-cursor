import { supabase } from './supabase'
import type { Meeting } from '@/types/meeting'
import type { Database } from '@/types/database'

type MeetingRow = Database['public']['Tables']['meetings']['Row']
type MeetingInsert = Database['public']['Tables']['meetings']['Insert']
type MeetingUpdate = Database['public']['Tables']['meetings']['Update']

// Convert database row to Meeting type
function dbRowToMeeting(row: MeetingRow): Meeting {
  return {
    id: row.id,
    title: row.title,
    time: row.time,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

// Get all meetings, ordered by time (most recent first)
export async function getAllMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .order('time', { ascending: false })

  if (error) {
    console.error('Error fetching meetings:', error)
    throw new Error('Failed to fetch meetings')
  }

  return data.map(dbRowToMeeting)
}

// Get a single meeting by ID
export async function getMeetingById(id: string): Promise<Meeting | null> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Meeting not found
    }
    console.error('Error fetching meeting:', error)
    throw new Error('Failed to fetch meeting')
  }

  return dbRowToMeeting(data)
}

// Create a new meeting
export async function createMeeting(
  meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>
): Promise<Meeting> {
  const meetingData: MeetingInsert = {
    title: meeting.title,
    time: meeting.time,
    content: meeting.content,
  }

  const { data, error } = await supabase
    .from('meetings')
    .insert(meetingData)
    .select()
    .single()

  if (error) {
    console.error('Error creating meeting:', error)
    throw new Error('Failed to create meeting')
  }

  return dbRowToMeeting(data)
}

// Update an existing meeting
export async function updateMeeting(
  id: string,
  updates: Partial<Omit<Meeting, 'id' | 'created_at' | 'updated_at'>>
): Promise<Meeting> {
  const updateData: MeetingUpdate = {}
  
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.time !== undefined) updateData.time = updates.time
  if (updates.content !== undefined) updateData.content = updates.content

  const { data, error } = await supabase
    .from('meetings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating meeting:', error)
    throw new Error('Failed to update meeting')
  }

  return dbRowToMeeting(data)
}

// Delete a meeting
export async function deleteMeeting(id: string): Promise<void> {
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting meeting:', error)
    throw new Error('Failed to delete meeting')
  }
} 