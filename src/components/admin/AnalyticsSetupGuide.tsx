import { KeyRound } from "lucide-react";
import { GUIDE } from "@/lib/analytics/guide-data";

// Render inline markers in a step string: `code` -> <code>, **bold** -> <strong>.
// Plain segments get " -- " prettified to an em dash (never inside code).
function fmt(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  const plain = (s: string) => s.replace(/ -- /g, " — ");
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(plain(text.slice(last, m.index)));
    if (m[1] !== undefined) out.push(<code key={key++}>{m[1]}</code>);
    else out.push(<strong key={key++}>{m[2]}</strong>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(plain(text.slice(last)));
  return out;
}

// Step-by-step guide: which Google APIs are needed, where to get the
// service-account credentials and IDs, and how to add them to the site — in
// strict order, written for someone who has never done this before.
export function AnalyticsSetupGuide() {
  return (
    <details className="an-guide">
      <summary className="an-guide__summary">
        <span className="an-guide__summary-ico">
          <KeyRound size={16} />
        </span>
        How to connect Google Analytics &amp; Search Console — full step-by-step
        guide (one-time setup)
      </summary>

      <div className="an-guide__body">
        <p className="an-guide__intro">{fmt(GUIDE.intro)}</p>

        {GUIDE.parts.map((part) => (
          <section className="an-guide__part" key={part.title}>
            <h4 className="an-guide__part-title">{part.title}</h4>
            <ol className="an-guide__steps">
              {part.steps.map((s, i) => (
                <li key={i}>{fmt(s)}</li>
              ))}
            </ol>
          </section>
        ))}

        <section className="an-guide__part">
          <h4 className="an-guide__part-title">
            The four values you paste into the site
          </h4>
          <table className="an-guide__env">
            <tbody>
              {GUIDE.envTable.map((e) => (
                <tr key={e.name}>
                  <td>
                    <code>{e.name}</code>
                  </td>
                  <td>{fmt(e.desc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="an-guide__part">
          <h4 className="an-guide__part-title">Good to know</h4>
          <ul className="an-guide__notes">
            {GUIDE.notes.map((n, i) => (
              <li key={i}>{fmt(n)}</li>
            ))}
          </ul>
        </section>
      </div>
    </details>
  );
}
