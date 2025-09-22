import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getKeysRequested,
  getKeyTypeRequested,
} from "@/state/valkey-features/keys/keyBrowserSlice";
import {
  selectKeys,
  selectLoading,
  selectError,
  selectKeyType,
} from "@/state/valkey-features/keys/keyBrowserSelectors";
import { useAppDispatch } from "@/hooks/hooks";
import { useParams } from "react-router";
import { AppHeader } from "./ui/app-header";
import { Compass, RefreshCcw, Key } from "lucide-react";

interface KeyInfo {
  key: string;
  type?: string;
}

export function KeyBrowser() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const keys : KeyInfo[] = useSelector(selectKeys(id!));
  const loading = useSelector(selectLoading(id!));
  const error = useSelector(selectError(id!));
  const selectedKeyType = useSelector(selectKeyType(id!, selectedKey!));

  useEffect(() => {
    if (id) {
      dispatch(getKeysRequested({ connectionId: id! }));
    }
  }, [id, dispatch]);

  const handleRefresh = () => {
    dispatch(getKeysRequested({ connectionId: id! }));
  };

  const handleKeyClick = (keyName: string) => {
    setSelectedKey(keyName);

    const keyInfo = keys.find((k) => k.key === keyName);
    if (keyInfo && !keyInfo.type) {
      dispatch(getKeyTypeRequested({ connectionId: id!, key: keyName }));
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <AppHeader title="Key Browser" icon={<Compass size={20} />} />

      {loading && <div className="ml-2">Loading keys...</div>}
      {error && <div className="ml-2">Error loading keys: {error}</div>}

      {/* Total Keys and Key Stats */}
      <div className="flex justify-between mb-8">
        <div className="h-20 w-1/4 p-4 dark:border-tw-dark-border border rounded flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">{keys.length}</span>
          <span className="font-light text-sm">Total Keys</span>
        </div>
        <div className="h-20 w-1/4 p-4 dark:border-tw-dark-border border rounded flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">TBD</span>
          <span className="font-light text-sm">Memory Usage</span>
        </div>
        <div className="h-20 w-1/4 p-4 dark:border-tw-dark-border border rounded flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">TBD</span>
          <span className="font-light text-sm">Operations</span>
        </div>
        <div className="h-20 w-1/5 p-4 dark:border-tw-dark-border border rounded flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">TBD</span>
          <span className="font-light text-sm">Hit Rate</span>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className="flex items-center w-full mb-4">
        <input
          placeholder="search"
          className="w-full h-10 p-2 dark:border-tw-dark-border border rounded"
        />
        <button
          onClick={handleRefresh}
          className="ml-2 px-4 py-2 bg-tw-primary text-white rounded"
        >
          <RefreshCcw />
        </button>
      </div>

      {/* Key Viewer - Takes remaining space */}
      <div className="flex flex-1 min-h-0">
        {/* Keys List */}
        <div className="w-1/2 pr-2">
          {keys.length === 0 ? (
            <div className="h-full p-2 dark:border-tw-dark-border border rounded flex items-center justify-center">
              No keys found
            </div>
          ) : (
            <div className="h-full dark:border-tw-dark-border border rounded overflow-hidden">
              <ul className="h-full overflow-y-auto space-y-2 p-2">
                {keys.map((keyInfo: { key: string }, index) => (
                  <li
                    key={index}
                    className="h-10 p-2 dark:border-tw-dark-border border cursor-pointer rounded flex items-center gap-2"
                    onClick={() => handleKeyClick(keyInfo.key)}
                  >
                    <Key size={16} /> {keyInfo.key}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Key Details */}
        <div className="w-1/2 pl-2">
          <div className="h-full dark:border-tw-dark-border border rounded">
            {selectedKey ? (
              <div className="p-4 text-sm font-light overflow-y-auto flex justify-between items-center">
                <span className="font-semibold mb-2 flex items-center gap-2"><Key size={16}/>{selectedKey}</span>
                <span className="bg-tw-accent text-sm px-2 rounded">{selectedKeyType}</span>
              </div>
            ) : (
              <div className="h-full p-4 text-sm font-light flex items-center justify-center text-gray-500">
                Select a key to see details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}