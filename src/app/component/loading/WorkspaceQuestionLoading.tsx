import React from 'react'

const WorkspaceQuestionLoading = () => {
    return (
        <div className="space-y-4 p-4 animate-pulse">
          {/* Question Skeleton */}
          <div className="bg-gray-200 h-6 rounded-md w-3/4"></div>
    
          {/* Options Skeleton */}
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="bg-gray-200 rounded-full h-4 w-4"></div>
                <div className="bg-gray-200 h-4 rounded-md w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      );
}

export default WorkspaceQuestionLoading