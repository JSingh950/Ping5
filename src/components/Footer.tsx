export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-4 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div className="text-2xl font-black">
          ping<span className="text-mint">!</span>
        </div>
        <div className="flex gap-3 text-sm text-white/50">
          <a href="#" className="hover:text-white">
            Terms of Service
          </a>
          <span>|</span>
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
        </div>
        <p className="text-xs text-white/50">© 2026 Ping Ring Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
