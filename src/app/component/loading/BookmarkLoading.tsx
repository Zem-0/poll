import React from 'react'

const BookmarkLoading = () => {
    const skeletonItems = Array.from({ length: 4 }); // Render 5 skeleton items as a placeholder

    return (
      <ul className="space-y-3 animate-pulse">
        {skeletonItems.map((_, index) => (
           <li
           key={index}
           className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
         >
            <div className="flex justify-between ">
              <div className="flex-1 space-y-6">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-10 bg-gray-300 rounded w-full"></div>
              </div>
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            </div>
          </li>
        ))}
      </ul>
    );
}

export default BookmarkLoading