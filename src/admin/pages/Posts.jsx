// Admin: posts, managed through the shared ResourceManager.
import ResourceManager from "../components/content/ResourceManager";
import { posts } from "../lib/resources";

export default function Posts() {
  return <ResourceManager config={posts} />;
}
