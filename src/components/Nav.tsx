export function Nav() {
  const links = [
    { label: "Ring", href: "#ring" },
    { label: "Teams", href: "#teams" },
    { label: "Why now", href: "#why-now" },
    { label: "Invest", href: "#invest" },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="border-b border-white/10 bg-black/80 px-4 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <a href="#" className="text-2xl font-black tracking-tight">
            ping<span className="text-mint">!</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#invest"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            Contact now
          </a>
        </div>
      </div>
    </header>
  );
}
