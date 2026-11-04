// Admin: team, managed through the shared ResourceManager.
import ResourceManager from "../components/content/ResourceManager";
import { team } from "../lib/resources";

export default function TeamManagement() {
  return <ResourceManager config={team} />;
}
