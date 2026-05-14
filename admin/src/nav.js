export const navItems = [
  {
    label: "Home",
    path: "/",
    roles: [
      "admin","demo_admin",
      "manager",
      "waiter",
      "receptionist",
      "cashier",
      "delivery_guy",
      "chef",
    ],
  },
  {
    label: "Floor Dashboard",
    path: "/floor",
    roles: ["admin","demo_admin"],
  },
  {
    label: "Takeaway",
    path: "/takeaway",
    roles: ["admin","demo_admin", "cashier", "manager"],
  },
  {
    label: "Staff Management",
    path: "/staff",
    roles: ["admin","demo_admin", "manager"],
  },
  {
    label: "Menu ",
    path: "/menu",
    roles: ["admin","demo_admin", "manager"],
  },
  {
    label: "Category ",
    path: "/category",
    roles: ["admin","demo_admin", "manager"],
  },

  {
    label: "Delivery Management",
    path: "/delivery",
    roles: ["admin","demo_admin", "manager", "receptionist"],
  },
  {
    label: "Waiter Dispatch",
    path: "/waiter/dispatch",
    roles: ["waiter"],
  },
  {
    label: "POS ",
    path: "/pos",
    roles: ["waiter"],
  },
  {
    label: "Unsettled Dinning Orders",
    path: "/unsettled-dinning-orders",
    roles: ["admin","demo_admin", "manager"], // no need to add cashier as it happened to be in his home dashboard
  },
]
