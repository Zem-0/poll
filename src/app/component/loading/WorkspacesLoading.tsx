import React from 'react'

const WorkspacesLoading = () => {
  return (
        <div className="animate-pulse">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center mb-4 p-2 rounded-md">
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="flex-1 h-6 bg-gray-300 ml-4 rounded-md"></div>
              <div className="h-6 w-6 bg-gray-300 ml-4 rounded-full"></div>
            </div>
          ))}
        </div>
  )
}

export default WorkspacesLoading