/* eslint-disable @next/next/no-img-element */
import React from "react";

import { CompletionData } from "@/app/types/Dashboard/Results";
import { StatCardProps } from "@/app/types/Results/Results";
import Text from "@/components/ui/Texts/Text";

const StatCard: React.FC<StatCardProps> = ({
  title,
  iconSrc,
  value,
  incrementValue,
  unit = "",
}) => {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 w-full xl:w-auto px-4 py-6 sm:px-6 xl:px-8">
      <div className="flex items-center justify-center gap-2">
          <Text variant="body13R" extraCSS="text-Dark-gray leading-6 ">
            {title}
          </Text>
        <img className="leading-6 text-Dark-gray" src={iconSrc} alt="" />
      </div>
      <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
        {value}
      </dd>
      <div className="w-full flex flex-row gap-2">
        {incrementValue && (
          <span className="text-Lime-Green font-bold">{incrementValue}</span>
        )}
        {unit && (
          <span className="font-bold text-exsm flex items-center text-Dark-gray">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

const Overview: React.FC<{ stats: CompletionData }> = ({ stats }) => {
  
  return (
    <div className="w-full bg-white rounded-xl flex-col flex md:flex-row">
      <StatCard
        title="People reached"
        iconSrc="/images/workspace/info.svg"
        value={stats?.people_reached}
        incrementValue={stats?.increment_people_reached}
        unit="this week"
      />

      <StatCard
        title="Starts"
        iconSrc="/images/workspace/info.svg"
        value={stats?.starts}
        incrementValue={stats?.increment_starts}
        unit="this week"
      />

      <StatCard
        title="Completion rate"
        iconSrc="/images/workspace/info.svg"
        value={stats?.completion_rate}
        incrementValue={stats?.increment_completion_rate}
        unit="this week"
      />

      <StatCard
        title="Time to complete"
        iconSrc="/images/workspace/info.svg"
        value={stats?.ai_time_to_complete}
        unit="than est."
      />
    </div>
  );
};

export default Overview;
