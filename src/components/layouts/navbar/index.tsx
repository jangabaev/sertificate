import { useState } from "react";
import { Link } from "react-router";
import { IoHomeOutline } from "react-icons/io5";
import { CiCircleList } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
const Navbar = () => {
  const [active, setActive] = useState("/");
  const items = [
    { id: "/", label: "Home", icon: <IoHomeOutline /> },
    { id: "/results", label: "Testlar", icon: <CiCircleList /> },
    { id: "/profil", label: "Profil", icon: <FaRegUserCircle /> },
  ];
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[rgb(var(--background))] text-[rgb(var(--text))] border-t border-gray-300 shadow-md flex justify-around items-center h-16 z-50">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.id}
          onClick={() => setActive(item.id)}
          className={`flex flex-col items-center text-sm transition-colors ${
            active === item.id
              ? "text-[rgb(var(--text-active))] "
              : "text-[rgb(var(--text-muted))] "
          }`}
        >
          {item.icon}
          <span className="mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
