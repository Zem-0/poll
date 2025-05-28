import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector, RootState } from "@/lib/store";
import {
  deleteReportItem,
  editReportTitle,
  setReportItems,
} from "@/lib/features/askPolly/askPollySlice";
import {
  deleteBookmark,
  editBookmark,
  getBookmarks,
  ReportItem,
} from "@/app/api/ask polly/polly";
import { poll } from "@/static/static_data";
import BookmarkSidebar from "./BookmarkSidebar";
import BookmarkLoading from "../../loading/BookmarkLoading";
import { useParams } from "next/navigation";

interface ReportSectionProps {
  isReportVisible: boolean;
  onClose: () => void;
}

const ReportSection: React.FC<ReportSectionProps> = ({
  isReportVisible,
  onClose,
}) => {
  const {pollid} = useParams();
  const pollId = Array.isArray(pollid) ? pollid[0] : pollid;
  const dispatch = useDispatch();
  const { reportItems, currentPollId } = useAppSelector(
    (state: RootState) => state.askPolly
  );

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookmark, setSelectedBookmark] = useState<ReportItem | null>(
    null
  );
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    return debouncedSearchTerm
      ? reportItems.filter(
          (item) =>
            item.title.toLowerCase().includes(searchLower) ||
            item.text.toLowerCase().includes(searchLower) ||
            item.user_query.toLowerCase().includes(searchLower)
        )
      : reportItems;
  }, [reportItems, debouncedSearchTerm]);

  // Data fetching
  const fetchBookmarks = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);

      // Use currentPollId to fetch poll-specific bookmarks
      const response = await getBookmarks(pollId);

      const transformedItems = response.data
        .map((bookmark: any) => ({
          id: bookmark._id,
          title: bookmark.title,
          text: bookmark.base_response,
          user_query: bookmark.user_query,
        }))
        .reverse();

      dispatch(setReportItems(transformedItems));
    } catch (err) {
      setError("Failed to fetch bookmarks");
      console.error("Error fetching bookmarks:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch bookmarks when currentPollId changes
  useEffect(() => {
    fetchBookmarks();
  }, [currentPollId]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Action handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookmarks(false);
  };

  const handleEditTitle = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    const item = reportItems.find((item) => item.id === id);
    setEditingItemId(id);
    setNewTitle(item?.user_query || "");
    setActiveMenuId(null);
  };

  // const updateTitle = (id: string, newTitle: string) => {
  //   dispatch(editReportTitle({ id, title: newTitle })); // Update Redux
  //   setSelectedBookmark((prev) => (prev && prev.id === id ? { ...prev, title: newTitle } : prev));
  // };

  const saveTitle = async (id: string) => {
    const item = reportItems.find((item) => item.id === id);
    if (!item || !newTitle.trim() || newTitle === item.user_query) {
      setEditingItemId(null);
      return;
    }

    try {
      setIsLoading(true);
      await editBookmark(id, newTitle, newTitle);

      dispatch(editReportTitle({ id, title: newTitle }));
      await fetchBookmarks(false);
      setEditingItemId(null);
      setNewTitle("");
    } catch (err) {
      console.error("Error updating title:", err);
      setError("Failed to update title");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      setError(null);

      // Optimistic delete
      dispatch(deleteReportItem(id));
      setActiveMenuId(null);

      // Actual API call
      await deleteBookmark(id);
    } catch (err) {
      setError("Failed to delete bookmark");
      console.error("Error deleting bookmark:", err);
      // Could revert the optimistic delete here
      await fetchBookmarks(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent sidebar from opening
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleBookmarkClick = (item: ReportItem) => {
    setSelectedBookmark(item);
    setSidebarVisible(true); // Open the sidebar
  };

  // Render helpers
  const renderListItem = (item: ReportItem) => (
    <li
      key={item.id}
      className={`bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${editingItemId === item.id ? "border border-yellow-300" : "border-none"}`}
      onClick={() => {
        if (editingItemId !== item.id) {
          handleBookmarkClick(item); // Only trigger if not editing
        }}}
    >
      <div className="flex justify-between items-start relative menu-container">
        <div className="w-full">
          {editingItemId === item.id ? (
            <div className="w-full flex flex-col">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle(item.id);
                  if (e.key === "Escape") {
                    setEditingItemId(null);
                    setNewTitle(item.user_query || "");
                  }
                }}
              />
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {item.text}
              </p>
              <button
                onClick={() => saveTitle(item.id)}
                className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm ml-auto"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-gray-900 line-clamp-3">
                  {item.user_query || "Untitled Bookmark"}
                </h4>
                <button
                  onClick={(e) => toggleMenu(e, item.id)}
                  className=" hover:bg-gray-100 rounded-full w-8 min-w-8 h-8 flex items-center justify-center translate-x-2"
                >
                  <img
                    src="/images/askPolly/verticalMenu.svg"
                    alt="Menu"
                    className="w-5 h-5"
                  />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {item.text}
              </p>
              {activeMenuId === item.id && (
                <div className="absolute right-0 bottom-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={(e) => handleEditTitle(e, item.id, item.title)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-200 first:rounded-t-md"
                  >
                    Edit Title
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-md"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );

  return (
    <div
      className={`flex flex-col w-full h-full p-4 bg-gray-50 border-l border-gray-200 ${
        isReportVisible
          ? "opacity-0 duration-0"
          : "opacity-100 duration-500 delay-200"
      } transition-opacity`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src="/images/askPolly/report.svg" alt="Report" />
          <h3 className="text-lg font-semibold text-gray-700">
            Added to report
          </h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-full hover:bg-gray-100 ${
            isRefreshing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Refresh bookmarks"
        >
          <img
            src="/images/askPolly/refreshBtn.svg"
            alt="Refresh"
            className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for saved responses"
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500"
      />

      {/* Content */}
      {isLoading ? (
        <div className="py-2">
        <BookmarkLoading />
      </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4 bg-red-50 rounded-md">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No bookmarks found</div>
      ) : (
        <div className="relative flex-1 overflow-hidden">
          <ul className="absolute inset-0 space-y-3 overflow-y-auto custom-scrollbar">
            {filteredItems.map(renderListItem)}
          </ul>
        </div>
      )}

      {isSidebarVisible && (
        <BookmarkSidebar
          item={selectedBookmark}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onClose={() => setSidebarVisible(false)}
          saveTitle={(id) => saveTitle(id)}
        />
      )}
    </div>
  );
};

export default ReportSection;
