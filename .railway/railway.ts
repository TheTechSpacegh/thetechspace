// Railway Infrastructure as Code for the public site + admin console.
//
//   railway config plan     # preview
//   railway config apply    # create/update the service
//
// This repository owns only the site. The API and database are a separate
// partial in the backend repo (TheTechSpacegh/tts_Backend); both target the
// same Railway project. See .github/DEPLOYMENT.md.
import { defineRailway, github, project, service } from "railway/iac";

export const partial = "site";

const REGION = "europe-west4"; // EU West (Amsterdam), same as the API

export default defineRailway((ctx) => {
  const site = service("tts-site", {
    // checkSuites: deploy a commit only after "Lint & build" passes on GitHub.
    source: github("TheTechSpacegh/thetechspace", { branch: "main", checkSuites: true }),
    // Railpack detects Vite, runs `npm run build` and serves dist/ with Caddy,
    // using the Caddyfile in this repo (security headers, SPA routing).
    healthcheck: "/health",
    replicas: { [REGION]: 1 },
    env: {
      // The API's public URL, built into the site. Shared with the API's own
      // API_URL so the two can never disagree.
      VITE_API_URL: ctx.shared.API_URL,
    },
  });

  return project("TheTechSpace", { resources: [site] });
});
