'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  position?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  title?: string
  showCloseButton?: boolean
  className?: string
  overlayClassName?: string
}

interface DrawerHeaderProps {
  children: React.ReactNode
  className?: string
}

interface DrawerBodyProps {
  children: React.ReactNode
  className?: string
}

interface DrawerFooterProps {
  children: React.ReactNode
  className?: string
}

// Header component for the drawer
export function DrawerHeader({ children, className = '' }: DrawerHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 bg-gray-50 ${className}`}>
      {children}
    </div>
  )
}

// Body component for the drawer content
export function DrawerBody({ children, className = '' }: DrawerBodyProps) {
  return (
    <div className={`flex-1 px-6 py-4 overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}

// Footer component for action buttons
export function DrawerFooter({ children, className = '' }: DrawerFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  )
}

// Main Drawer component
export function Drawer({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  title,
  showCloseButton = true,
  className = '',
  overlayClassName = ''
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const lastActiveElement = useRef<HTMLElement | null>(null)

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg', 
    xl: 'max-w-xl',
    full: 'max-w-full'
  }

  // Position and animation classes
  const getDrawerClasses = () => {
    const baseClasses = 'fixed top-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col'
    const sizeClass = sizeClasses[size]
    
    if (position === 'left') {
      return `${baseClasses} left-0 ${sizeClass} ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
    } else {
      return `${baseClasses} right-0 ${sizeClass} ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
    }
  }

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      lastActiveElement.current = document.activeElement as HTMLElement
      
      // Focus the drawer
      if (drawerRef.current) {
        drawerRef.current.focus()
      }
      
      // Add event listener for escape key
      document.addEventListener('keydown', handleKeyDown)
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Remove event listener
      document.removeEventListener('keydown', handleKeyDown)
      
      // Restore body scroll
      document.body.style.overflow = 'unset'
      
      // Restore focus to the element that was focused before the drawer opened
      if (lastActiveElement.current) {
        lastActiveElement.current.focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  // Don't render if not open or if we're on the server
  if (!isOpen || typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-modal="true"
      role="dialog"
      aria-label={title || 'Drawer panel'}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${overlayClassName}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`${getDrawerClasses()} ${className}`}
        tabIndex={-1}
        role="document"
      >
        {/* Header with title and close button */}
        {(title || showCloseButton) && (
          <DrawerHeader>
            <div className="flex items-center justify-between">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  aria-label="Close drawer"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </DrawerHeader>
        )}
        
        {/* Content */}
        {children}
      </div>
    </div>,
    document.body
  )
}

// Button components for common actions
interface DrawerButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  className?: string
}

export function DrawerButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '' 
}: DrawerButtonProps) {
  const baseClasses = 'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

// Cancel button specifically for drawer footer
export function DrawerCancelButton({ onCancel }: { onCancel: () => void }) {
  return (
    <DrawerButton variant="secondary" onClick={onCancel}>
      Cancel
    </DrawerButton>
  )
}

// Save button specifically for drawer footer  
export function DrawerSaveButton({ 
  onSave, 
  disabled = false,
  isLoading = false 
}: { 
  onSave: () => void
  disabled?: boolean
  isLoading?: boolean 
}) {
  return (
    <DrawerButton 
      variant="primary" 
      onClick={onSave} 
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Saving...' : 'Save'}
    </DrawerButton>
  )
} 