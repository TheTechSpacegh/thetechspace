// Built-in services, used when the TTS API can't be reached. The live list is
// edited in Admin → Services.
import WD1 from "../assets/img/WD1.webp";
import GD1 from "../assets/img/GD1.webp";
import UI2 from "../assets/img/UI2.webp";
import S1 from "../assets/img/S1.webp";

export const services = [
  {
    id: "web",
    title: "Website design & development",
    description: "Custom websites built with modern technologies, optimized for performance and conversions.",
    features: ["Responsive design", "SEO optimization", "Fast loading speed", "CMS integration", "E-commerce solutions", "Maintenance & support"],
    image: WD1,
  },
  {
    id: "brand",
    title: "Graphic design & branding",
    description: "Visual identity and marketing materials that make your brand stand out from the competition.",
    features: ["Logo design", "Brand identity", "Marketing materials", "Print design", "Packaging design", "Social media graphics"],
    image: GD1,
  },
  {
    id: "product",
    title: "UI/UX design",
    description: "User-centered design that creates intuitive experiences and drives engagement across all devices.",
    features: ["User research", "Wireframing", "Prototyping", "User testing", "Mobile app design", "Design systems"],
    image: UI2,
  },
  {
    id: "marketing",
    title: "SEO & marketing",
    description: "Boost your online visibility and drive qualified traffic to your website. Data-driven strategies that turn visits into enquiries.",
    features: ["Search engine optimization", "Content marketing", "Social media marketing", "Pay-per-click advertising", "Email campaigns", "Analytics & reporting"],
    image: S1,
  },
];
