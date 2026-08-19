import { useEffect, useState } from "react";
import { PageHero } from "../components/Common.jsx";
import { useStore } from "../store/StoreContext.jsx";

const draftKey = "srk-contact-draft";
const readDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(draftKey)) || {};
  } catch {
    return {};
  }
};

export default function ContactPage() {
  const [form, setForm] = useState(readDraft);
  const [status, setStatus] = useState("");
  const { notify } = useStore();
  useEffect(() => {
    document.title = "Contact — SRK Fragrance";
  }, []);
  const update = (event) => {
    const next = { ...form, [event.target.name]: event.target.value };
    setForm(next);
    try {
      localStorage.setItem(draftKey, JSON.stringify(next));
    } catch {
      /* Storage can be unavailable. */
    }
  };
  const submit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      setStatus("Please complete the highlighted fields.");
      return;
    }
    const submittedData = {
      fullName: form.name || "",
      email: form.email || "",
      phone: form.phone || "",
      subject: form.subject || "",
      message: form.message || "",
    };
    console.info("SRK Fragrance contact form submission", submittedData);
    setStatus("Thank you. Your message has been sent successfully.");
    notify("Message sent successfully. We’ll be in touch soon.");
    setForm({});
    try {
      localStorage.removeItem(draftKey);
    } catch {
      /* Non-critical. */
    }
  };
  return (
    <main id="main">
      <PageHero eyebrow="Personal guidance" title="Contact">
        <p>
          Have a question about our fragrances? We’re here to help you choose,
          order, and enjoy them.
        </p>
      </PageHero>
      <section className="section container">
        <div className="contact-grid">
          <aside className="contact-details">
            <p className="eyebrow">Speak with us</p>
            <h2>A thoughtful answer, every time.</h2>
            <p>
              Whether you need scent guidance or help with an order, our team
              would be pleased to assist.
            </p>
            <div className="contact-list">
              <div>
                <strong>Phone</strong>
                <a href="tel:+918885978692">+91 88859 78692</a>
              </div>
              <div>
                <strong>Email</strong>
                <a href="mailto:info@srkfragrance.com">info@srkfragrance.com</a>
              </div>
              <div>
                <strong>Location</strong>
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div>
                <strong>Business hours</strong>
                <span>Monday–Saturday, 10:00–18:00 IST</span>
              </div>
            </div>
          </aside>
          <div className="contact-card">
            <div className="contact-card-heading">
              <p className="eyebrow">Send a note</p>
              <h2>How can we help?</h2>
              <p>Share a few details and our fragrance team will respond thoughtfully.</p>
            </div>
            <form className="contact-form" onSubmit={submit} noValidate>
              <div className="form-field">
                <label htmlFor="full-name">Full name</label>
                <input
                  id="full-name"
                  name="name"
                  value={form.name || ""}
                  onChange={update}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  value={form.email || ""}
                  onChange={update}
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone || ""}
                  onChange={update}
                  type="tel"
                  autoComplete="tel"
                  pattern="[0-9+() -]{8,18}"
                />
              </div>
              <div className="form-field">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject || ""}
                  onChange={update}
                  required
                >
                  <option value="">Choose a subject</option>
                  <option>Fragrance guidance</option>
                  <option>Order support</option>
                  <option>Delivery or returns</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message || ""}
                  onChange={update}
                  required
                  minLength="10"
                />
              </div>
              <div className="form-field full">
                <button className="button button-dark" type="submit">
                  Send message
                </button>
              </div>
              <p className="form-status" aria-live="polite">
                {status}
              </p>
            </form>
          </div>
        </div>
      </section>
      <section className="section story-section" id="delivery">
        <div className="container story-grid">
          <div>
            <p className="eyebrow">Delivery</p>
            <h2>Carefully packed, clearly communicated.</h2>
            <p>
              We offer complimentary standard delivery above ₹999. Dispatch and
              delivery estimates are shared before checkout in a production
              purchase flow.
            </p>
          </div>
          <div id="returns">
            <p className="eyebrow">Returns</p>
            <h2>Support beyond delivery.</h2>
            <p>
              Unopened products may be returned within 7 days of delivery.
              Contact our team with your order information to begin.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
