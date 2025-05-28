const navigation = [
  // {
  //   name: "Workspaces",
  //   href: "home",
  //   icon: "images/home_icon.svg",
  //   current: true,
  // },
  {
    name: "My workspace",
    icon: "images/polls.svg",
    current: false,
    children: [
      { name: "Polls", href: "polls" },
      { name: "Completed", href: "completed" },
    ],
  },
  // { name: "Wallet", href: "wallet", icon: "images/wallet.svg", current: false },
  // {
  //   name: "Integrations",
  //   href: "integrations",
  //   icon: "images/integrations.svg",
  //   current: false,
  // },
  // {
  //   name: "Promote",
  //   href: "promote",
  //   icon: "images/promote.svg",
  //   current: false,
  // },
];

// Prepare properly encoded dashboard URL
const dashboardUrl = `/dashboard/${encodeURIComponent("My workspace")}`;

const userNavigation = [
  { name: "Profile", href: dashboardUrl, imgSrc: "" },
  { name: "Edit profile", href: dashboardUrl },
  { name: "Analytics", href: dashboardUrl, imgSrc: "/images/workspace/filled.svg" },
  { name: "Team", href: dashboardUrl, imgSrc: "/images/workspace/team.svg" },
  { name: "Upgrade to pro", href: "/pricing", imgSrc: "/images/workspace/pro.svg" },
  { name: "Account settings", href: dashboardUrl, imgSrc: "" },
  { name: "Log out", href: "/", imgSrc: "" },
];

const location = [
  { id: 1, name: "Leslie Alexander" },
  // More users...
];
const industry = [
  { id: 1, name: "Aerospace" },
  { id: 2, name: "Agriculture & Related" },
  { id: 3, name: "Automobiles" },
  { id: 4, name: "Banking & Finance" },
  { id: 5, name: "Chemicals" },
  { id: 6, name: "Construction" },
  { id: 7, name: "Defense" },
  { id: 8, name: "Energy" },
  { id: 9, name: "Entertainment" },
  { id: 10, name: "Food & Beverages" },
  { id: 11, name: "Government" },
  { id: 12, name: "Healthcare" },
  { id: 13, name: "Hospitality" },
  { id: 14, name: "Insurance" },
  { id: 15, name: "Legal" },
  { id: 16, name: "Life Sciences & Medical Devices" },
  { id: 17, name: "Manufacturing" },
  { id: 18, name: "Media" },
  { id: 19, name: "Mining" },
  { id: 20, name: "Professional Services" },
  { id: 21, name: "Technology" },
  { id: 22, name: "Telecommunications" },
  { id: 23, name: "Other" },
];

const poll = [
  {
    name: "Healthcare leadership",
    domain: "Market research",
    visibility: "Private",
    target: {
      number: 100,
      date: "27 Jan 2024",
    },
    length: {
      time: 10,
      questions: 12,
    },
    completion: "0%",
    status: "Building",
  },
  {
    name: "Healthcare leadership",
    domain: "Market research",
    visibility: "Private",
    target: {
      number: 100,
      date: "27 Jan 2024",
    },
    length: {
      time: 10,
      questions: 12,
    },
    completion: "20%",
    status: "Ready",
  },
  {
    name: "Healthcare leadership",
    domain: "Published: 24 Dec 2023",
    visibility: "Private",
    target: {
      number: 100,
      date: "27 Jan 2024",
    },
    length: {
      time: 10,
      questions: 12,
    },
    completion: "50%",
    status: "Collecting",
  },
  {
    name: "Healthcare leadership",
    domain: "Published: 24 Dec 2023",
    visibility: "Private",
    target: {
      number: 100,
      date: "27 Jan 2024",
    },
    length: {
      time: 10,
      questions: 12,
    },
    completion: "75%",
    status: "Paused",
  },
  {
    name: "Healthcare leadership",
    domain: "Published: 24 Dec 2023",
    visibility: "Private",
    target: {
      number: 100,
      date: "27 Jan 2024",
    },
    length: {
      time: 10,
      questions: 12,
    },
    completion: "10%",
    status: "Collecting",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// const salutations = ["Mr", "Mrs", "Ms", "Dr."];

const peopleA = [
  { id: 1, name: "Academic Research" },
  { id: 2, name: "Brand Perception" },
  { id: 3, name: "Competitive Intelligence" },
  { id: 4, name: "Customer Feedback" },
  { id: 5, name: "Educational Assessments" },
  { id: 6, name: "Election Forecasting" },
  { id: 7, name: "Employee Engagement" },
  { id: 8, name: "Event Planning" },
  { id: 9, name: "Gauging Public Opinion" },
  { id: 10, name: "Health Assessments" },
  { id: 11, name: "Market Research" },
  { id: 12, name: "Advocacy & Policy" },
  { id: 13, name: "Product Feedback" },
  { id: 14, name: "Program Evaluation" },
  { id: 15, name: "Quality Control" },
  { id: 16, name: "Resource Allocation" },
  { id: 17, name: "Service Feedback" },
  { id: 18, name: "Social Research" },
  { id: 19, name: "Trend Analysis" },
  { id: 20, name: "User Experience Research" },
  { id: 21, name: "General Audience Survey" },
];

const peopleB = [
  { id: 1, name: "Some School" },
  { id: 2, name: "High School" },
  { id: 3, name: "Trade or Technical School" },
  { id: 4, name: "Bachelor's Degree" },
  { id: 5, name: "Master's Degree or Higher" },
];

const peopleC = [
  { id: 1, name: "Aerospace" },
  { id: 2, name: "Agriculture & Related" },
  { id: 3, name: "Automobiles" },
  { id: 4, name: "Banking & Finance" },
  { id: 5, name: "Chemicals" },
  { id: 6, name: "Construction" },
  { id: 7, name: "Defense" },
  { id: 8, name: "Energy" },
  { id: 9, name: "Entertainment" },
  { id: 10, name: "Food & Beverages" },
  { id: 11, name: "Government" },
  { id: 12, name: "Healthcare" },
  { id: 13, name: "Hospitality" },
  { id: 14, name: "Insurance" },
  { id: 15, name: "Legal" },
  { id: 16, name: "Life Sciences & Medical Devices" },
  { id: 17, name: "Manufacturing" },
  { id: 18, name: "Media" },
  { id: 19, name: "Mining" },
  { id: 20, name: "Professional Services" },
  { id: 21, name: "Technology" },
  { id: 22, name: "Telecommunications" },
  { id: 23, name: "Other" },
];
const notificationMethods = [
  { id: "basic", title: "Basic", state: "done_bullet" },
  { id: "audience", title: "Audience", state: "active_bullet" },
];

const statuses = {
  offline: "text-gray-500 bg-gray-100/10",
  online: "text-green-400 bg-green-400/10",
  error: "text-rose-400 bg-rose-400/10",
};
const environments = {
  Preview: "text-gray-400 bg-gray-400/10 ring-gray-400/20",
  Production: "text-indigo-400 bg-indigo-400/10 ring-indigo-400/30",
};
const deployments = [
  {
    id: 1,
    teamName: "Basic",
    status: "online",
  },
  {
    id: 2,
    teamName: "Audience",
    status: "offline",
  },
];
const salutation = [
  { id: 1, name: "Mr" },
  { id: 2, name: "Mrs" },
  { id: 3, name: "Devon Webb" },
];

export {
  navigation,
  userNavigation,
  location,
  industry,
  classNames,
  poll,
  peopleA,
  peopleB,
  peopleC,
  notificationMethods,
  statuses,
  environments,
  deployments,
  salutation,
};
