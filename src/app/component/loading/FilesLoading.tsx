import React from "react";

const FilesLoading = () => {
  return (
    <table className="min-w-full bg-white rounded-lg shadow-md animate-pulse">
    <thead className="bg-gray-100">
      <tr>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
          TITLE
        </th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
          FILE NAME
        </th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
          CATEGORY
        </th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
          PAGES
        </th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
          UPLOADED
        </th>
      </tr>
    </thead>
    <tbody>
      {[...Array(5)].map((_, index) => (
        <tr
          key={index}
          className="border-b last:border-b-0"
        >
          <td className="py-3 px-4">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          </td>
          <td className="py-3 px-4">
            <div className="h-5 bg-gray-300 rounded w-full"></div>
          </td>
          <td className="py-3 px-4">
            <div className="h-5 bg-gray-300 rounded w-2/4"></div>
          </td>
          <td className="py-3 px-4">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          </td>
          <td className="py-3 px-4">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  );
};

export default FilesLoading;
