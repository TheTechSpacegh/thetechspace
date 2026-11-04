// Admin: testimonials, managed through the shared ResourceManager.
import ResourceManager from "../components/content/ResourceManager";
import { testimonials } from "../lib/resources";

export default function Testimonials() {
  return <ResourceManager config={testimonials} />;
}
