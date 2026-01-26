import { Badge } from "@/components/Badge";
import { ExternalLink } from "@/components/ExternalLink";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { portfolio } from "@/lib/portfolio";
import Image from "next/image";

const labelByType = {
  know: "What I Know",
  learned: "What I Learned",
  aspiring: "What I’m Aspiring To",
} as const;

export default function Home() {
  const learningSentence =
    portfolio.currentlyLearning.length === 0
      ? ""
      : portfolio.currentlyLearning.length === 1
      ? portfolio.currentlyLearning[0]
      : `${portfolio.currentlyLearning.slice(0, -1).join(", ")} and ${
          portfolio.currentlyLearning.slice(-1)[0]
        }`;
  const emailLink = portfolio.links.find(
    (l) =>
      l.href.startsWith("mailto:") ||
      l.label.toLowerCase() === "email" ||
      /.+@.+\..+/.test(l.href)
  );
  const emailAddress = emailLink
    ? emailLink.href.startsWith("mailto:")
      ? emailLink.href.replace(/^mailto:/, "")
      : emailLink.href
    : undefined;
  return (
    <div className="stack">
      <Section
        id="about"
        title="About Me"
        description="A short bio with a photo."
      >
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {portfolio.photo ? (
              <Image
                src={portfolio.photo}
                alt={portfolio.photoAlt ?? portfolio.name}
                width={portfolio.photoWidth ?? 240}
                height={portfolio.photoHeight ?? 240}
                className="rounded-lg object-cover"
                priority
              />
            ) : null}
            <div className="space-y-3">
              <h3 className="project-title">Hi, I’m {portfolio.name}.</h3>
              <p className="project-desc">
                {portfolio.about ?? "Add a brief introduction about yourself here."}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <section className="card">
        <div className="space-y-3">
          <Badge variant="neutral">Hero Statement</Badge>
          <h1 className="hero-title">
            {portfolio.heroStatement}
          </h1>
          <p className="helper-text">
            Keep this to one sentence: who you are + what you build + what you care about.
          </p>
        </div>
      </section>

      <Section
        id="projects"
        title="The Big Three"
        description="One project that shows what you know, one that shows what you learned, and one that shows what you're aspiring to do."
      >
        <div className="grid-3">
          {portfolio.bigThree.map((project) => (
            <article
              key={`${project.type}-${project.title}`}
              className="card"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="project-title">
                  {project.title}
                </h3>
                <Badge variant={project.type}>{labelByType[project.type]}</Badge>
              </div>

              <p className="project-desc">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Badge key={t} variant="neutral">
                    {t}
                  </Badge>
                ))}
              </div>

              <ul className="bullets">
                {project.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <div className="links-row" style={{ marginTop: 16 }}>
                {project.href ? (
                  <ExternalLink
                    href={project.href}
                    className="button-link"
                  >
                    Live
                  </ExternalLink>
                ) : null}
                {project.repo ? (
                  <ExternalLink
                    href={project.repo}
                    className="button-link"
                  >
                    Code
                  </ExternalLink>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="learning"
        title="Currently Learning"
        description="A short sentence about current focus areas."
      >
        <div className="card">
          <p className="section-desc">
            {learningSentence}
          </p>
        </div>
      </Section>

      <Section
        id="contact"
        title="Contact"
        description="Send me a message and find my socials."
      >
        <div className="stack">
          <ContactForm recipientEmail={emailAddress} />

          <div className="links-row" aria-label="Social links">
            {portfolio.links
              .filter((l) => !l.href.startsWith("mailto:"))
              .map((link) => (
                <ExternalLink
                  key={link.href}
                  href={link.href}
                  className="button-link"
                >
                  {link.label}
                </ExternalLink>
              ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
