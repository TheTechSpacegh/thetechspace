// Admin: services, managed through the shared ResourceManager.
import ResourceManager from "../components/content/ResourceManager";
import { services } from "../lib/resources";

export default function ServicesManagement() {
  return <ResourceManager config={services} />;
}
