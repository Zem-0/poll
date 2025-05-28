import Text from "@/components/ui/Texts/Text";

const PollsLoading = () => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th scope="col" className="w-1/2 text-left p-3">
            <Text
              variant="body13M"
              extraCSS="pl-14 font-semibold text-textGray"
            >
              Polls
            </Text>
          </th>
          <th scope="col" className="text-center p-3">
            <Text variant="body13M" extraCSS="font-semibold text-textGray">
              Visibility
            </Text>
          </th>
          <th scope="col" className="text-center p-3">
            <Text variant="body13M" extraCSS="font-semibold text-textGray">
              Target response
            </Text>
          </th>
          <th scope="col" className="text-center p-3">
            <Text variant="body13M" extraCSS="font-semibold text-textGray">
              Length
            </Text>
          </th>
          <th scope="col" className="text-center p-3">
            <Text variant="body13M" extraCSS="font-semibold text-textGray">
              Completion
            </Text>
          </th>
          <th scope="col" className="text-center p-3">
            <Text variant="body13M" extraCSS="font-semibold text-textGray">
              Status
            </Text>
          </th>
        </tr>
      </thead>
      <tbody className="animate-pulse divide-y divide-gray-100 bg-white">
        {[...Array(5)].map((_, idx) => (
          <tr key={idx} className="h-12">
            {/* Polls Column */}
            <td className="whitespace-nowrap p-3">
              <div className="flex items-center">
                <div className="h-11 w-11 bg-gray-300 rounded-full"></div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div className="h-4 w-3/4 bg-gray-300 rounded-md"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded-md mt-2"></div>
                </div>
              </div>
            </td>

            {/* Visibility Column */}
            <td className="whitespace-nowrap px-3 py-5 text-center">
              <div className="h-4 w-1/3 bg-gray-300 rounded-md mx-auto"></div>
            </td>

            {/* Target Response Column */}
            <td className="whitespace-nowrap px-3 py-5 text-center">
              <div className="h-4 w-1/2 bg-gray-300 rounded-md mx-auto"></div>
              <div className="h-3 w-1/3 bg-gray-300 rounded-md mx-auto mt-2"></div>
            </td>

            {/* Length Column */}
            <td className="whitespace-nowrap px-3 py-5 text-center">
              <div className="h-4 w-1/2 bg-gray-300 rounded-md mx-auto"></div>
              <div className="h-3 w-1/3 bg-gray-300 rounded-md mx-auto mt-2"></div>
            </td>

            {/* Completion Column */}
            <td className="whitespace-nowrap px-3 py-5 text-center">
              <div className="h-4 w-1/4 bg-gray-300 rounded-md mx-auto"></div>
            </td>

            {/* Status Column */}
            <td className="whitespace-nowrap px-3 py-5 text-center">
              <div className="h-8 w-24 bg-gray-300 rounded-md mx-auto"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PollsLoading;
