import type { ReactNode } from "react";

type Partner = {
  name: string;
  logo: ReactNode;
};

const partners: Partner[] = [
  {
    name: "Salesforce",
    logo: (
      <svg viewBox="0 0 92 64" aria-hidden="true" className="h-9 w-14">
        <path
          fill="#00A1E0"
          d="M38.2 12.8a17.7 17.7 0 0 1 28.6 7.5 13.6 13.6 0 0 1 4.7-.8 14.5 14.5 0 0 1 0 29H24.3a16.5 16.5 0 0 1-1.4-32.9 18.4 18.4 0 0 1 15.3-2.8Z"
        />
        <text
          x="46"
          y="36"
          fill="white"
          fontSize="11"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
        >
          salesforce
        </text>
      </svg>
    ),
  },
  {
    name: "HubSpot",
    logo: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-10 w-10">
        <path
          stroke="#FF5C35"
          strokeWidth="5"
          strokeLinecap="round"
          d="M22 28 34 17M37 18l10 7M27 38l10 6"
        />
        <circle cx="20" cy="30" r="9" fill="#FF5C35" />
        <circle cx="39" cy="14" r="7" fill="#FF5C35" />
        <circle cx="48" cy="28" r="7" fill="#FF5C35" />
        <circle cx="41" cy="47" r="8" fill="#FF5C35" />
      </svg>
    ),
  },
  {
    name: "Notion",
    logo: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-10 w-10">
        <rect x="9" y="9" width="46" height="46" rx="4" fill="white" />
        <path
          fill="black"
          d="M18 17.5 46.5 15v32L18 49.5V17.5Zm7.2 9.2v3.4l3.8-.5v12.1l-3.5.5v3h10.7v-3l-3.5-.4V28.5l.2-.1 9.6 16.8h3.9V24.7l3-.4V21H39.3v3.2l3.6.4v11.8l-.2.1-9.2-15.7H25l-3.4.4v3.4l3.6.1Z"
        />
      </svg>
    ),
  },
  {
    name: "Granola",
    logo: (
      <svg viewBox="0 0 112 40" aria-hidden="true" className="h-9 w-24">
        <rect width="112" height="40" rx="20" fill="#F7D46B" />
        <circle cx="21" cy="20" r="10" fill="#111" />
        <circle cx="24.5" cy="17" r="3.5" fill="#F7D46B" />
        <text
          x="38"
          y="25"
          fill="#111"
          fontSize="17"
          fontWeight="800"
          fontFamily="Arial, sans-serif"
        >
          Granola
        </text>
      </svg>
    ),
  },
  {
    name: "Gmail",
    logo: (
      <svg viewBox="0 0 64 48" aria-hidden="true" className="h-9 w-12">
        <path fill="#F2F2F2" d="M8 8h48v32H8z" />
        <path fill="#EA4335" d="M8 14.5V40h9.2V21.4L32 32.5l14.8-11.1V40H56V14.5L32 32.5 8 14.5Z" />
        <path fill="#FBBC04" d="M8 8v6.5l9.2 6.9V14.9L8 8Z" />
        <path fill="#34A853" d="M46.8 21.4V40H56V14.5l-9.2 6.9Z" />
        <path fill="#4285F4" d="M56 8v6.5l-9.2 6.9v-6.5L56 8Z" />
      </svg>
    ),
  },
  {
    name: "Outlook",
    logo: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-10 w-10">
        <rect x="24" y="13" width="28" height="36" rx="3" fill="#0078D4" />
        <path fill="#28A8EA" d="M34 24h20v24H34z" />
        <path fill="#50D9FF" d="m34 24 10 9 10-9v-4H34z" />
        <rect x="9" y="20" width="29" height="29" rx="3" fill="#0078D4" />
        <text x="23.5" y="39" fill="white" fontSize="18" fontWeight="800" textAnchor="middle">
          O
        </text>
      </svg>
    ),
  },
  {
    name: "Google Calendar",
    logo: (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-10 w-10">
        <path fill="#4285F4" d="M12 12h40v40H12z" />
        <path fill="#34A853" d="M12 24h10v28H12z" />
        <path fill="#FBBC04" d="M42 24h10v28H42z" />
        <path fill="#EA4335" d="M12 12h40v12H12z" />
        <rect x="20" y="20" width="24" height="24" fill="white" />
        <text x="32" y="38" fill="#3C4043" fontSize="17" fontWeight="800" textAnchor="middle">
          31
        </text>
      </svg>
    ),
  },
];

export function PartnerLogoGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "flex flex-wrap items-center gap-3"
          : "flex flex-wrap items-center justify-center gap-5"
      }
    >
      {partners.map((partner) => (
        <div
          key={partner.name}
          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/70 transition-colors hover:border-mint/40 hover:bg-white/[0.1] hover:text-white"
        >
          <span className="flex h-10 w-14 items-center justify-center">{partner.logo}</span>
          <span className={compact ? "text-xs font-bold" : "text-sm font-bold"}>
            {partner.name}
          </span>
        </div>
      ))}
    </div>
  );
}
