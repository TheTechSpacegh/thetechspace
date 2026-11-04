// Admin: milestones, managed through the shared ResourceManager.
import ResourceManager from "../components/content/ResourceManager";
import { milestones } from "../lib/resources";

export default function MilestonesManagement() {
  return <ResourceManager config={milestones} />;
}
