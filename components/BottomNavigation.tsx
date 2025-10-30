import Link from "next/link";
import { HandPlatter, User, Settings } from "lucide-react";

const items = [
  {
    title: "Menus",
    url: "/",
    icon: <HandPlatter className="h-6 w-6" />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <User className="h-6 w-6" />,
  },
  {
    title: "About",
    url: "/about",
    icon: <Settings className="h-6 w-6" />,
  },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-around bg-white shadow-t dark:bg-gray-900 dark:shadow-t-gray-800">
      {items.map((item, ind) => (
        <Link
          href={item.url}
          className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
          key={ind}
        >
          {item.icon}
          <span className="text-xs">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
