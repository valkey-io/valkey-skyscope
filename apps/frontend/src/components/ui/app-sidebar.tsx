import {
  LayoutDashboard,
  Send,
  HousePlug,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Cog,
  CircleQuestionMark,
  Github,
} from "lucide-react";
import { selectStatus } from "@/state/valkey-features/connection/connectionSelectors.ts";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import { CONNECTED } from "@common/src/constants";

export function AppSidebar() {
  const isConnected = useSelector(selectStatus) === CONNECTED;
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getNavItemClasses = (path: string) => {
    return location.pathname === path
      ? "bg-tw-primary text-white border border-white rounded"
      : "text-gray-600 hover:text-tw-primary";
  };

  return (
    <nav
      className={`bg-white ${isExpanded ? "w-52 items-start" : "w-18 items-center"
        } h-screen p-4 shadow-lg border-r-2 flex flex-col justify-between transition-all duration-300 items-center relative`}
    >
      <div className={`flex ${isExpanded ? "items-start" : "items-center"}  flex-col`}>
        {/* Header */}
        <div className="flex items-center" title="Skyscope">
          <img src="../../assets/img/logo.png" alt="logo" className="h-8" />
          {isExpanded && (
            <span className="ml-3 font-bold text-lg">Skyscope</span>
          )}
        </div>

        {/* menu items */}
        <div className="mt-10">
          <ul className="space-y-2">
            {[
              // Always show connect
              { to: "/connect", title: "Connections", icon: HousePlug },
              // Rest of the menu items only if connected
              ...(isConnected
                ? [
                    {
                      to: "/dashboard",
                      title: "Dashboard",
                      icon: LayoutDashboard,
                    },
                    { to: "/sendcommand", title: "Send Command", icon: Send },
                    {
                      to: "/",
                      title: "Monitoring",
                      icon: ChartNoAxesCombined,
                    },
                  ]
                : []),
            ].map(({ to, title, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex p-2 ${getNavItemClasses(to)}`}
                  title={title}
                >
                  <Icon size={22} />
                  {isExpanded && <span className="ml-3">{title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* expand/collapse sidebar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1 cursor-pointer rounded-full bg-white border-2 text-tw-primary hover:bg-tw-primary hover:text-white absolute top-1/2 right-[-14px] z-10"
        title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
      </button>
      <div>
        <ul className="space-y-2">
          {[
            {
              href: "https://github.com/",
              title: "GitHub",
              icon: Github,
              isExternal: true,
            },
            { to: "/settings", title: "Settings", icon: Cog },
            { to: "/learnmore", title: "Learn More", icon: CircleQuestionMark },
          ].map((item) => (
            <li key={item.to || item.href}>
              {item.isExternal ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex p-2 text-gray-600 hover:text-tw-primary"
                  title={item.title}
                >
                  <item.icon size={22} />
                  {isExpanded && <span className="ml-3">{item.title}</span>}
                </a>
              ) : (
                <Link
                  to={item.to || ""}
                  className={`flex p-2 ${getNavItemClasses(item.to || "")}`}
                  title={item.title}
                >
                  <item.icon size={22} />
                  {isExpanded && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
