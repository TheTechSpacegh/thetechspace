// Admin: projects, managed through the shared ResourceManager.
import ResourceManager from "../components/content/ResourceManager";
import { projects } from "../lib/resources";

export default function ProjectsManagement() {
  return <ResourceManager config={projects} />;
}
