import { site, waLink } from "@/content/site";
import { EnquiryForm } from "./EnquiryForm";

export function Contact() {
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <p className="eyebrow">Contact</p>
        <div className="contact-grid">
          <div className="contact-side">
            <h2>
              Ready for the <em>first move</em>?
            </h2>
            <p className="lede">
              Tell me a little about who the training is for and where they are today. I&apos;ll come
              back to you on WhatsApp with how we&apos;d start.
            </p>
            <a className="wa-big" href={waLink("Hi Jagadeesh, I'd like to know more about chess coaching.")}>
              Message on WhatsApp <span aria-hidden="true">&#8599;</span>
            </a>
            <span className="num">{site.whatsappDisplay}</span>
          </div>
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
