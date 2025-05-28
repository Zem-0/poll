const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  // { name: "Flow", href: "flow", current: false },
  { name: "Outline", href: "outline", current: true },
  // { name: "Integrations", href: "integrations", current: false },
  // { name: "Share", href: "share", current: false },
  { name: "Results", href: "results", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const question_importance = [
  {
    val: "must have",
    text: "Must have",
  },
  {
    val: "nice to have",
    text: "Nice to have",
  },
  {
    val: "normal",
    text: "Normal",
  },
];

// const question_importance = [
//   { text: "Low", val: "low" },
//   { text: "Normal", val: "normal" },
//   { text: "High", val: "high" }
// ];

export { user, navigation, userNavigation, question_importance };
