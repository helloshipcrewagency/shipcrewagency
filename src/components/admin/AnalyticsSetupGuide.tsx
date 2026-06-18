import { KeyRound } from "lucide-react";

// Step-by-step guide: which Google APIs are needed, where to get the
// service-account credentials and IDs, and how to add them to the site.
export function AnalyticsSetupGuide() {
  return (
    <details className="an-guide">
      <summary className="an-guide__summary">
        <span className="an-guide__summary-ico">
          <KeyRound size={16} />
        </span>
        How to connect Google Analytics &amp; Search Console (one-time setup)
      </summary>

      <div className="an-guide__body">
        <p className="an-guide__intro">
          Everything on this page is read through a single Google{" "}
          <strong>service account</strong> — a robot Google account that is
          allowed to read your analytics. You create it once, give it read
          access to your GA4 property and your Search Console site, then paste
          four values into the hosting settings. Takes about 10 minutes.
        </p>

        <ol className="an-guide__steps">
          <li>
            <h4>1 · Create a Google Cloud project</h4>
            <p>
              Go to{" "}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                console.cloud.google.com
              </a>
              . At the top, click the project dropdown →{" "}
              <strong>New Project</strong>. Name it anything (e.g. “Ship Crew
              Analytics”) and create it. Make sure it is selected afterwards.
            </p>
          </li>

          <li>
            <h4>2 · Turn on the two APIs</h4>
            <p>
              In the search bar at the top, find and enable each of these (open
              it, then click <strong>Enable</strong>):
            </p>
            <ul>
              <li>
                <strong>Google Analytics Data API</strong> — for the visitor
                numbers, top pages and countries.
              </li>
              <li>
                <strong>Google Search Console API</strong> — for the search
                keywords and search pages.
              </li>
            </ul>
          </li>

          <li>
            <h4>3 · Create a service account + key file</h4>
            <p>
              Left menu → <strong>APIs &amp; Services → Credentials</strong> →{" "}
              <strong>Create Credentials → Service account</strong>. Give it a
              name and click <strong>Done</strong>. Then open the new service
              account → <strong>Keys</strong> tab →{" "}
              <strong>Add key → Create new key → JSON</strong>. A{" "}
              <code>.json</code> file downloads — keep it safe, it is the
              password. Inside it you will see{" "}
              <code>client_email</code> and <code>private_key</code>.
            </p>
          </li>

          <li>
            <h4>4 · Give the service account read access</h4>
            <p>
              Copy the service account email (the{" "}
              <code>client_email</code>, looks like{" "}
              <code>name@project.iam.gserviceaccount.com</code>) and add it as a
              viewer in both places:
            </p>
            <ul>
              <li>
                <strong>Analytics (GA4):</strong> open{" "}
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  analytics.google.com
                </a>{" "}
                → <strong>Admin</strong> (gear, bottom-left) →{" "}
                <strong>Property Access Management</strong> → <strong>+</strong>{" "}
                → paste the email → role <strong>Viewer</strong> → Add.
              </li>
              <li>
                <strong>Search Console:</strong> open{" "}
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  search.google.com/search-console
                </a>{" "}
                → <strong>Settings → Users and permissions →
                Add user</strong> → paste the email → permission{" "}
                <strong>Full</strong> (or Restricted) → Add.
              </li>
            </ul>
          </li>

          <li>
            <h4>5 · Find your two IDs</h4>
            <ul>
              <li>
                <strong>GA4 Property ID</strong> — in Analytics →{" "}
                <strong>Admin → Property Settings</strong>. It is a number near
                the top, e.g. <code>312345678</code> (digits only — not the
                “G-XXXX” measurement ID).
              </li>
              <li>
                <strong>Search Console site URL</strong> — the exact property
                name as shown in Search Console. For a URL-prefix property use
                the full address with the trailing slash, e.g.{" "}
                <code>https://www.shipcrewagency.com/</code>. For a Domain
                property use <code>sc-domain:shipcrewagency.com</code>.
              </li>
            </ul>
          </li>

          <li>
            <h4>6 · Add the four values to the site</h4>
            <p>
              In Vercel → your project →{" "}
              <strong>Settings → Environment Variables</strong>, add these four
              (then redeploy):
            </p>
            <table className="an-guide__env">
              <tbody>
                <tr>
                  <td>
                    <code>GOOGLE_CLIENT_EMAIL</code>
                  </td>
                  <td>
                    the <code>client_email</code> from the JSON file
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>GOOGLE_PRIVATE_KEY</code>
                  </td>
                  <td>
                    the <code>private_key</code> from the JSON file — paste it
                    whole, including the{" "}
                    <code>-----BEGIN PRIVATE KEY-----</code> and{" "}
                    <code>-----END PRIVATE KEY-----</code> lines
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>GA4_PROPERTY_ID</code>
                  </td>
                  <td>the property number from step 5, e.g. 312345678</td>
                </tr>
                <tr>
                  <td>
                    <code>GSC_SITE_URL</code>
                  </td>
                  <td>the site URL / sc-domain value from step 5</td>
                </tr>
              </tbody>
            </table>
            <p className="an-guide__note">
              The private key contains line breaks. Pasting it directly from the
              JSON works — the site accepts both real line breaks and the
              escaped <code>\n</code> form. You only need GA4 or Search Console,
              not both; add whichever set of values you have and that section
              will light up.
            </p>
          </li>

          <li>
            <h4>7 · Redeploy</h4>
            <p>
              Press <strong>Redeploy</strong> in Vercel. Reload this page and
              your live numbers appear. Search Console figures lag Google’s own
              dashboard by 2–3 days — that is normal.
            </p>
          </li>
        </ol>
      </div>
    </details>
  );
}
