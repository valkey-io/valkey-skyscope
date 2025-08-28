type AppHeaderProps = {
  title: string;
  icon: React.ReactNode;
  servername: string;
  port: string;
};

function AppHeader({ title, icon, servername, port }: AppHeaderProps) {
  return (
    <div className="flex h-10 mb-4 gap-2 items-center justify-between">
      <h1 className="font-bold text-xl flex items-center gap-2">
        {icon}
        {title}
      </h1>
      <div className="">
        <span className="text-sm font-light border-2 border-tw-primary text-tw-primary px-3 py-1 rounded">
          {/* localhost is a placeholder for now */}
          {servername} @ localhost:{port}
        </span>
      </div>
    </div>
  );
}

export { AppHeader };
