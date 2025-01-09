import { useLoginForm } from './login/useLoginForm';
import MemberNumberInput from './login/MemberNumberInput';
import LoginButton from './login/LoginButton';
import LegalLinks from './login/LegalLinks';

const LoginForm = () => {
  const { memberNumber, setMemberNumber, loading, handleLogin } = useLoginForm();

  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
        <MemberNumberInput
          memberNumber={memberNumber}
          setMemberNumber={setMemberNumber}
          loading={loading}
        />

        <LoginButton loading={loading} />
        <LegalLinks />
      </form>
    </div>
  );
};

export default LoginForm;