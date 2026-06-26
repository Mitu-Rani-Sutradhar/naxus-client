export const metadata = {
  title: "Privacy Policy | NaxusAI",
  description: "Privacy Policy for NaxusAI platform",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: June 26, 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">1. Introduction</h2>
          <p>
            NaxusAI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy and is
            committed to protecting the personal information you share with us. This Privacy
            Policy explains how we collect, use, and safeguard your data when you use our
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account information such as name and email address.</li>
            <li>Usage data, including pages visited and tools accessed.</li>
            <li>Information you submit through contact forms or support requests.</li>
            <li>Cookies and similar tracking technologies for analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and maintain our services.</li>
            <li>To respond to inquiries and support requests.</li>
            <li>To improve our platform and develop new features.</li>
            <li>To send updates, promotions, or service-related notifications.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">4. Sharing Your Information</h2>
          <p>
            We do not sell your personal information. We may share data with trusted third-party
            service providers who help us operate the platform, subject to confidentiality
            obligations, or when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">5. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect your data
            from unauthorized access, alteration, or disclosure. However, no method of
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any
            time by contacting us through our{" "}
            <a href="/contact" className="text-black underline">
              Contact page
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">8. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please reach out via our{" "}
            <a href="/contact" className="text-black underline">
              Contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}