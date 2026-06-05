import { SiteChrome } from "@/components/layout/SiteChrome";
import { NotFoundView } from "@/components/pages/NotFoundView";

// Global 404 (unmatched URLs) — render outside the (site)/zh layouts, so it
// brings its own header + footer.
export default function NotFound() {
  return (
    <SiteChrome lang="en">
      <NotFoundView lang="en" />
    </SiteChrome>
  );
}
