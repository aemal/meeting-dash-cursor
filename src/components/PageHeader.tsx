import { PlusIcon } from '@heroicons/react/24/outline'

interface PageHeaderProps {
  onAddMeeting: () => void
}

export function PageHeader({ onAddMeeting }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Meeting Minutes
        </h1>
        <p className="mt-2 text-gray-600">
          View, create, and edit your meeting minutes
        </p>
      </div>
      
      <button
        onClick={onAddMeeting}
        className="
          inline-flex items-center px-4 py-2 border border-transparent 
          text-sm font-medium rounded-md shadow-sm text-white 
          bg-blue-600 hover:bg-blue-700 focus:outline-none 
          focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          transition-colors duration-200 ease-in-out
        "
      >
        <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
        Add Meeting Minutes
      </button>
    </div>
  )
} 