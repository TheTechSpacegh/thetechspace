import { Check } from "lucide-react";
import ServicesExplorer from "@/components/sections/ServicesExplorer";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import PageHeader from "../components/ui/PageHeader";
import { ButtonLink, Container, Mono, SectionHeading, Status } from "../components/ui/primitives";
import { FinalCta } from "../components/home/PeopleAndLabs";
import { buildLog } from "../data/buildLog";
import { ServiceOrbit } from "@/components/sections/HeroVisuals";
import { useServices } from "@/lib/content";

const moreServices = [
  { title: "Digital strategy", description: "Comprehensive digital strategies that align with your business goals." },
  { title: "Performance optimization", description: "Speed up your website and improve user experience across all devices." },
];

const pad = (n) => String(n).padStart(2, "0");

export default function ServicesPage() {
  const services = useServices();
  return (
    <div>
      <PageHeader
        crumb="Services"
        badge="Design · Build · Grow"
        title="Design, build and growth under one roof."
        lede="From concept to launch, we provide end-to-end digital services that help your business thrive."
        actions={
          <>
            <ButtonLink to="/contact" arrow>Get a quote</ButtonLink>
            <ButtonLink to="/services#process" variant="ghostOnDark">See how we work</ButtonLink>
          </>
        }
        aside={<ServiceOrbit />}
      />

      {services ? <ServicesExplorer services={services} /> : <ContentSkeleton variant="split" />}

      {/* Also available */}
      <section aria-label="Also available" className="bg-canvas">
        <Container className="pb-20 md:pb-28">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {moreServices.map((s) => (
              <li key={s.title} className="bg-panel p-7">
                <h3 className="font-display text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-dim">{s.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The build process */}
      <section id="process" aria-labelledby="process-title" className="scroll-mt-24 border-y border-line bg-panel">
        <Container className="py-20 md:py-28">
          <SectionHeading
            id="process-title"
            title="Clear steps, no guesswork."
            lede="Every build follows the same steps, so you always know what happens next and what you'll see along the way."
          />
          <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {buildLog.map((step) => {
              const launch = step.day === buildLog.length;
              return (
                <li
                  key={step.day}
                  className={`rounded-xl border p-5 ${launch ? "border-brand bg-brand text-white" : "border-line bg-canvas"}`}
                >
                  <Mono className={launch ? "text-white/80" : "text-brand"}>step {pad(step.day)}</Mono>
                  <h3 className={`mt-2 font-display text-lg font-bold leading-tight ${launch ? "text-white" : "text-ink"}`}>{step.title}</h3>
                  <p className={`mt-2 text-sm ${launch ? "text-white/85" : "text-dim"}`}>{step.detail}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <div className="bg-canvas pt-24">
        <FinalCta />
      </div>
    </div>
  );
}
