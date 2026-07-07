import { Battery, Layers, Orbit, Radio } from "lucide-react";

const items = [
  {
    Icon: Radio,
    title: "Instant share",
    body: "Tap your ring to any NFC-enabled phone and share your profile instantly.",
  },
  {
    Icon: Orbit,
    title: "Track connections",
    body: "Visualize and manage your circles so the people you meet never disappear into a camera roll or inbox.",
  },
  {
    Icon: Layers,
    title: "All-in-one identity",
    body: "LinkedIn, Instagram, X, email, phone, Venmo, projects, and proof of work in one clean tap.",
  },
  {
    Icon: Battery,
    title: "Daily simple",
    body: "No charging, no Bluetooth, no app install required for the person receiving your Ping.",
  },
];

export function Features() {
  return (
    <section className="relative border-y border-white/10 bg-white/[0.03] px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 md:grid-cols-4">
        {items.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="bg-black/80 p-7 backdrop-blur transition-colors hover:bg-white/[0.06]"
          >
            <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-black">
              <Icon className="h-6 w-6" strokeWidth={2.3} />
            </div>
            <h3 className="mb-3 text-xl font-bold">{title}</h3>
            <p className="text-sm leading-6 text-white/60">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
