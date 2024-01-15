import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  {
    id: 3,
    title: "Chat",
    path: "/chat",
    newTab: false,
  },
  {
    id: 5,
    title: "My Donations",
    path: "/mydonations",
    newTab: false,
  },
  {

    id: 6,
    title: "Donations",
    path: "/donations",
    newTab: false,
  },
  {
    id: 7,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 61,
        title: "About Page",
        path: "/about",
        newTab: false,
      },
      {
        id: 62,
        title: "Chat Page",
        path: "/Chat",
        newTab: false,
      },
      {
        id: 63,
        title: "Sign Up Page",
        path: "/auth/signup",
        newTab: false,
      },
      {
        id: 64,
        title: "Sign In Page",
        path: "/auth/signin",
        newTab: false,
      },
      {
        id: 65,
        title: "Error Page",
        path: "/error",
        newTab: false,
      },
    ],
  },
];
export default menuData;
