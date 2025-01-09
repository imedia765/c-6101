import { useState } from 'react';
import TermsDialog from '../TermsDialog';
import PrivacyDialog from '../PrivacyDialog';

const LegalLinks = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <div className="text-center text-sm text-dashboard-text mt-4">
        By logging in, you agree to our{' '}
        <button 
          onClick={(e) => {
            e.preventDefault();
            setShowTerms(true);
          }}
          className="text-dashboard-accent1 hover:underline"
        >
          PWA Collector Member Responsibilities
        </button>{' '}
        and{' '}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowPrivacy(true);
          }}
          className="text-dashboard-accent1 hover:underline"
        >
          Pakistan Welfare Association Membership Terms
        </button>
      </div>

      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
    </>
  );
};

export default LegalLinks;