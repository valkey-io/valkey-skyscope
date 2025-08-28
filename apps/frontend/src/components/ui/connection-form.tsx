type ConnectionFormProps = {
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  host: string;
  port: string;
  username: string;
  password: string;
  setHost: (host: string) => void;
  setPort: (port: string) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
};

function ConnectionForm({
  onSubmit,
  onClose,
  host,
  port,
  username,
  password,
  setHost,
  setPort,
  setUsername,
  setPassword,
}: ConnectionFormProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border">
        <h2 className="text-lg font-semibold">Connection Form</h2>
        <span className="text-sm font-light">
          Enter your server's host and port to connect.
        </span>

        <form className="space-y-4 mt-4" onSubmit={onSubmit}>
          <div>
            <label className="block mb-1 text-sm">Host</label>
            <input
              type="text"
              placeholder="localhost"
              required
              className="w-full px-3 py-2 border rounded"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Port</label>
            <input
              type="number"
              placeholder="6379"
              required
              className="w-full px-3 py-2 border rounded"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 text-sm">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-tw-primary text-white rounded hover:bg-tw-primary/90"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConnectionForm;
