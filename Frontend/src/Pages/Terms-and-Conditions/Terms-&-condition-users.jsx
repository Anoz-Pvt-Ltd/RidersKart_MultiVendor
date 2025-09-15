import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-700 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="mb-6">
        Welcome to our e-commerce platform (“Platform”). By accessing, browsing,
        or making a purchase on our website, you agree to comply with and be
        bound by the following Terms and Conditions (“Terms”). Please read them
        carefully before using our services. If you do not agree with any part
        of these Terms, you must not use this Platform.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Eligibility</h2>
      <p>
        You must be at least 18 years of age to register and make purchases on
        our Platform. By using our services, you represent and warrant that you
        are legally capable of entering into binding contracts.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. Account Registration
      </h2>
      <ul className="list-disc list-inside space-y-1">
        <li>
          You are required to create an account to access certain features.
        </li>
        <li>
          You must provide accurate, current, and complete information during
          registration and keep your account details updated.
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your login
          credentials and all activities under your account.
        </li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Products and Pricing
      </h2>
      <p>
        All products listed on our Platform are subject to availability. We
        reserve the right to modify or discontinue products without prior
        notice. Prices are subject to change and may vary due to promotions,
        offers, or other circumstances. While we strive to ensure accuracy,
        errors in pricing or product descriptions may occur.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Orders and Payments
      </h2>
      <ul className="list-disc list-inside space-y-1">
        <li>
          Placing an order constitutes an offer to purchase the products.
          Acceptance occurs only when we confirm your order via email or SMS.
        </li>
        <li>
          Payment must be made through the available options (credit/debit card,
          UPI, net banking, wallets, or cash on delivery, if applicable).
        </li>
        <li>
          We reserve the right to cancel or refuse orders at our discretion,
          including in cases of suspected fraud or product unavailability.
        </li>
      </ul>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Shipping and Delivery
      </h2>
      <p>
        We aim to deliver products within the estimated timelines; however,
        delays may occur due to unforeseen circumstances. Delivery charges,
        timelines, and restrictions are displayed at checkout. Risk of loss and
        title for products pass to you upon delivery.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        6. Returns, Refunds, and Cancellations
      </h2>
      <ul className="list-disc list-inside space-y-1">
        <li>
          Returns are accepted within 7 days of delivery, subject to product
          eligibility (unused, in original packaging).
        </li>
        <li>
          Refunds will be processed within 5–7 business days after inspection
          and approval.
        </li>
        <li>
          Certain products (perishables, personal care items, customized goods)
          are non-returnable and non-refundable.
        </li>
        <li>
          Orders may be canceled prior to dispatch. Post-dispatch cancellations
          may incur fees or be declined.
        </li>
      </ul>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        7. User Responsibilities
      </h2>
      <p>
        You agree not to misuse the Platform for unlawful purposes, including
        but not limited to:
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>Engaging in fraudulent transactions or misrepresentation.</li>
        <li>Distributing viruses, malware, or harmful code.</li>
        <li>Attempting unauthorized access to systems or user accounts.</li>
        <li>Infringing upon intellectual property rights.</li>
      </ul>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        8. Intellectual Property
      </h2>
      <p>
        All content on the Platform, including logos, trademarks, images,
        product descriptions, and designs, is owned by or licensed to us. You
        may not reproduce, distribute, or use such content without prior written
        consent.
      </p>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        9. Privacy and Data Protection
      </h2>
      <p>
        Your use of the Platform is also governed by our Privacy Policy, which
        outlines how we collect, use, and safeguard your personal data.
      </p>

      {/* Section 10 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        10. Limitation of Liability
      </h2>
      <p>
        To the fullest extent permitted by law, we are not liable for any
        direct, indirect, incidental, consequential, or punitive damages arising
        from your use of the Platform, including but not limited to product
        performance, delivery delays, or unauthorized access.
      </p>

      {/* Section 11 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">11. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless our company, its
        directors, employees, and affiliates from any claims, damages, or
        expenses arising from your use of the Platform or violation of these
        Terms.
      </p>

      {/* Section 12 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">12. Termination</h2>
      <p>
        We may suspend or terminate your access to the Platform at our
        discretion, without prior notice, if we believe you have violated these
        Terms or engaged in prohibited activities.
      </p>

      {/* Section 13 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        13. Governing Law and Jurisdiction
      </h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of
        India. Any disputes arising shall be subject to the exclusive
        jurisdiction of the courts located in [Your City/State].
      </p>

      {/* Section 14 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">14. Changes to Terms</h2>
      <p>
        We reserve the right to update or modify these Terms at any time without
        prior notice. Continued use of the Platform constitutes acceptance of
        the revised Terms.
      </p>

      {/* Section 15 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">
        15. Contact Information
      </h2>
      <p>
        For questions or concerns regarding these Terms and Conditions, please
        contact us at: <br />
        <strong>Email:</strong> support@yourecommerce.com <br />
        <strong>Phone:</strong> +91-XXXXXXXXXX
      </p>

      <p className="mt-10 text-sm text-gray-500">
        Last Updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default TermsAndConditions;
