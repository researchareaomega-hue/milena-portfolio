import { LegalPage } from "@/components/site/LegalPage";

export default function Terms() {
  return (
    <LegalPage
      testId="terms-title"
      eyebrow="Governance"
      title="Terms of Service"
      intro="These terms govern access to this site, operated on behalf of Vanguard Digital Assets™ and managed by Milena. By using this site or its communication channel, you accept them in full."
      sections={[
        { title: "Purpose of This Site", body: "This site presents the professional profile of Milena and provides a single official channel for business inquiries. Nothing published here constitutes an offer, solicitation, or investment advice." },
        { title: "Communications", body: "All messages submitted through Secure Communications are logged and retained in an internal inbox. Submission does not create any obligation, partnership, or fiduciary relationship. Responses are issued at the sole discretion of Vanguard Digital Assets™." },
        { title: "Confidentiality", body: "Transactions referenced on this site are described in summary form. Counterparty identities and commercial terms are withheld under non-disclosure obligations and will not be disclosed on request." },
        { title: "Acceptable Use", body: "You agree not to submit unlawful, misleading, or unsolicited promotional content, and not to attempt to access restricted areas of this site. Abuse of the communication channel may result in blocked access." },
        { title: "Intellectual Property", body: "All names, marks, and content on this site, including Vanguard Digital Assets™ and Echelon Gameworks™, remain the property of their respective owners and may not be reproduced without written consent." },
        { title: "Limitation of Liability", body: "This site is provided as is. Vanguard Digital Assets™ accepts no liability for decisions made on the basis of its content or for any interruption of its availability." },
      ]}
    />
  );
}
