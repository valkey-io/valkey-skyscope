import {
  LayoutDashboard,
  Unplug,
  Send,
  HousePlug,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { setConnected as valkeySetConnected } from "@/state/valkey-features/connection/connectionSlice.ts";
import { selectConnected } from "@/state/valkey-features/connection/connectionSelectors.ts";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/hooks";
import { useNavigate, Link, useLocation } from "react-router";
import { useState } from "react";

export function AppSidebar() {
  const isConnected = useSelector(selectConnected);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDisconnect = () => {
    dispatch(valkeySetConnected(false));
    navigate("/connect");
  };

  const getNavItemClasses = (path: string) => {
    return location.pathname === path
      ? "bg-tw-primary text-white border border-white rounded"
      : "text-gray-600 hover:text-tw-primary";
  };

  return (
    <nav
      className={`bg-white ${
        isExpanded ? "w-52 items-start" : "w-18 items-center"
      } h-screen p-4 shadow-lg border-r-2 flex flex-col justify-between transition-all duration-300 items-center relative`}
    >
      <div
        className={`flex ${
          isExpanded ? "items-start" : "items-center"
        }  flex-col`}
      >
        {/* Header */}
        <div className="flex items-center" title="Skyscope">
          <img src="../../assets/img/logo.png" alt="logo" className="h-8" />
          {isExpanded && (
            <span className="ml-3 font-bold text-lg">Skyscope</span>
          )}
        </div>

        {/* menu items */}
        {isConnected && (
          <div className="mt-10">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/connect"
                  className={`flex p-2 ${getNavItemClasses("/connect")}`}
                  title="Connections"
                >
                  <HousePlug size={22} />
                  {isExpanded && <span className="ml-3">Connections</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className={`flex p-2 ${getNavItemClasses("/dashboard")}`}
                  title="Dashboard"
                >
                  <LayoutDashboard size={22} />
                  {isExpanded && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/sendcommand"
                  className={`flex p-2 ${getNavItemClasses("/sendcommand")}`}
                  title="Send Command"
                >
                  <Send size={22} />
                  {isExpanded && <span className="ml-3">Send Command</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className={`flex p-2 ${getNavItemClasses("/")}`}
                  title="Monitoring"
                >
                  <ChartNoAxesCombined size={22} />
                  {isExpanded && <span className="ml-3">Monitoring</span>}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* expand/collapse sidebar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1 cursor-pointer rounded-full bg-white border-2 text-tw-primary hover:bg-tw-primary hover:text-white absolute top-1/2 right-[-14px] z-10"
        title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
      </button>

      {/* disconnect */}
      {isConnected && (
        <button
          onClick={handleDisconnect}
          className="w-full flex p-2 rounded text-tw-primary border-1 border-tw-primary hover:bg-tw-primary hover:text-white"
          title="Disconnect"
        >
          <Unplug size={22} />
          {isExpanded && <span className="ml-3">Disconnect</span>}
        </button>
      )}
    </nav>
  );
}
