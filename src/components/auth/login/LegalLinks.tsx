import { useState } from 'react';
import TermsDialog from '../TermsDialog';
import PrivacyDialog from '../PrivacyDialog';

const LegalLinks = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <div className="text-center text-sm text-dashboard-text mt-4">
        By logging in, you agree to the PWA Collector Member Responsibilities and Pakistan Welfare Association Membership Terms
      </div>

      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
    </>
  );
};

export default LegalLinks;