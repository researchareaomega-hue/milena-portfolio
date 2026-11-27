import { LegalPage } from "@/components/site/LegalPage";

export default function Privacy() {
  return (
    <LegalPage
      testId="privacy-title"
      eyebrow="Disclosure"
      title="Privacy Policy"
      intro="Discretion is a core principle of Vanguard Digital Assets™. This policy explains what information is collected through this site and how it is handled."
      sections={[
        { title: "Information Collected", body: "When you submit an inquiry, we record your name, email address, organization if provided, subject, message, and the time of submission. No tracking profiles are built and no advertising cookies are used." },
        { title: "How It Is Used", body: "Information is used solely to review and respond to your inquiry. It is never sold, rented, or shared with third parties for marketing purposes." },
        { title: "Logging and Confidentiality", body: "Every communication is logged in a private internal inbox accessible only to authorized executive personnel. All correspondence is treated as confidential." },
        { title: "Retention", body: "Inquiries are retained for as long as reasonably necessary for business review and record keeping, after which they are permanently deleted." },
        { title: "Security", body: "Access to the internal inbox is restricted by credential verification. Data is transmitted over encrypted connections." },
        { title: "Your Rights", body: "You may request access to, correction of, or deletion of your submitted information by sending a new inquiry through Secure Communications referencing your original message." },
      ]}
    />
  );
}
