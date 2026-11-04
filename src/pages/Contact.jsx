import { useState } from "react";
import { useSearchParams } from "react-router";
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { sendContactMessage } from "../lib/sendContactMessage";
import FaqSection from "@/components/sections/FaqSection";
import { ContactQuickCard } from "@/components/sections/HeroVisuals";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectType: "",
  budget: "",
  details: "",
  website: "", // honeypot: hidden from people, bots fill it in
};

const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-dim transition-colors focus:outline-none focus-visible:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

const labelClass = "block text-sm font-medium text-ink/85 mb-1.5";

// TODO(content): the phone number and street address below are placeholders.
const contactChannels = [
  {
    icon: Mail,
    title: "Email us",
    note: "Send us an email anytime",
    content: (
      <a href="mailto:hello@thetechspace.com" className="font-medium text-brand hover:text-brand-bright">
        hello@thetechspace.com
      </a>
    ),
  },
  {
    icon: Phone,
    title: "Call us",
    note: "Mon–Fri from 9am to 6pm",
    content: (
      <a href="tel:+15551234567" className="font-medium text-brand hover:text-brand-bright">
        +1 (555) 123-4567
      </a>
    ),
  },
  {
    icon: MapPin,
    title: "Visit us",
    note: "Come say hello at our office",
    content: (
      <address className="not-italic text-ink/85">
        123 Tech Street
        <br />
        Digital City, DC 12345
      </address>
    ),
  },
  {
    icon: Clock,
    title: "Business hours",
    note: null,
    content: (
      <div className="text-dim space-y-1">
        <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
        <p>Saturday: 10:00 AM – 4:00 PM</p>
        <p>Sunday: Closed</p>
      </div>
    ),
  },
];

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on scope. We work in short, visible steps so websites launch fast, and larger web apps and products get a clear plan with you on the first call.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "Yes! We offer various support and maintenance packages to keep your website secure, updated, and performing optimally.",
  },
  {
    question: "What's included in your web development service?",
    answer:
      "Our web development includes responsive design, SEO optimization, content management system, security features, and basic training on how to use your new website.",
  },
  {
    question: "Can you work with our existing brand guidelines?",
    answer: "We can work within your existing brand guidelines or help you develop new ones if needed.",
  },
];

export default function ContactPage() {
  // A brief sent from the homepage hero arrives as ?brief=…&services=a|b
  const [params] = useSearchParams();
  const [form, setForm] = useState(() => {
    const services = (params.get("services") || "").split("|").filter(Boolean);
    const brief = params.get("brief") || "";
    const extra = services.length > 1 ? `

Services: ${services.join(", ")}` : "";
    return { ...EMPTY_FORM, projectType: services[0] || "", details: brief ? brief + extra : extra.trim() };
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendContactMessage(form);
      setStatus("sent");
      setForm(EMPTY_FORM);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        crumb="Contact"
        badge="Let's talk"
        title="Tell us what you're building."
        lede="Send a few details and we'll plan your project on a call. We reply within 24 hours on business days."
        aside={<ContactQuickCard />}
      />

      {/* Contact Form & Info */}
      <section className="bg-canvas py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12">
            {/* Contact Form */}
            <div className="ticks rounded-2xl border border-line bg-panel p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-ink mb-1">Send us a message</h2>
              <p className="text-sm text-dim mb-6">
                Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.
              </p>

              {status === "sent" ? (
                <div role="status" className="flex items-start gap-3 rounded-xl border border-brand/30 bg-brand-soft p-5">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-ink">Message sent — thank you.</p>
                    <p className="mt-1 text-sm text-dim">We reply within 24 hours on business days.</p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-3 text-sm font-semibold text-brand hover:text-brand-bright"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form id="brief" className="scroll-mt-28 space-y-5" onSubmit={handleSubmit}>
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>First name *</label>
                      <input id="firstName" name="firstName" type="text" autoComplete="given-name" required placeholder="John" value={form.firstName} onChange={update("firstName")} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>Last name *</label>
                      <input id="lastName" name="lastName" type="text" autoComplete="family-name" required placeholder="Doe" value={form.lastName} onChange={update("lastName")} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className={labelClass}>Email address *</label>
                      <input id="email" name="email" type="email" autoComplete="email" required placeholder="john@example.com" value={form.email} onChange={update("email")} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone number</label>
                      <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+233 20 000 0000" value={form.phone} onChange={update("phone")} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="projectType" className={labelClass}>Project type</label>
                      <div className="relative">
                        <select id="projectType" name="projectType" value={form.projectType} onChange={update("projectType")} className={`${inputClass} appearance-none pr-10`}>
                          <option value="">Select a service</option>
                          <option>Website Design & Development</option>
                          <option>Web or mobile app</option>
                          <option>UI/UX Design</option>
                          <option>Graphic Design & Branding</option>
                          <option>Marketing & SEO</option>
                          <option>Digital Strategy</option>
                          <option>Joining the TTS team</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dim" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="budget" className={labelClass}>Project budget</label>
                      <div className="relative">
                        <select id="budget" name="budget" value={form.budget} onChange={update("budget")} className={`${inputClass} appearance-none pr-10`}>
                          <option value="">Select budget range</option>
                          <option>$5,000 - $10,000</option>
                          <option>$10,000 - $25,000</option>
                          <option>$25,000 - $50,000</option>
                          <option>$50,000+</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dim" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="details" className={labelClass}>Project details *</label>
                    <textarea
                      id="details"
                      name="details"
                      required
                      placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                      rows={5}
                      value={form.details}
                      onChange={update("details")}
                      className={inputClass}
                    />
                  </div>

                  {status === "error" && (
                    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      We couldn't send your message. Please try again, or email us directly at{" "}
                      <a href="mailto:hello@thetechspace.com" className="font-semibold underline">hello@thetechspace.com</a>.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-semibold text-white transition-colors hover:bg-brand-bright disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                    {status === "sending" ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-ink mb-3">Other ways to reach us</h2>
              <p className="text-lg text-dim mb-8">
                We're here to help bring your vision to life. Reach out to us through any of the channels below, and
                we'll get back to you within 24 hours.
              </p>

              <ul className="divide-y divide-line border-y border-line">
                {contactChannels.map(({ icon: Icon, title, note, content }) => (
                  <li key={title} className="flex items-start gap-4 py-5">
                    <div className="w-11 h-11 rounded-full bg-brand-soft flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink">{title}</h3>
                      {note && <p className="text-sm text-dim mb-1">{note}</p>}
                      {content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        items={faqs}
        title="Questions before you reach out?"
        lede="Quick answers to common questions about our services and process."
      />
    </div>
  );
}
