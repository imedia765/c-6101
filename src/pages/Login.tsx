import LoginForm from '@/components/auth/LoginForm';
import CommitteeUpdate from '@/components/auth/CommitteeUpdate';
import MembershipExpectations from '@/components/auth/MembershipExpectations';
import ImportantInformation from '@/components/auth/ImportantInformation';
import MedicalExaminer from '@/components/auth/MedicalExaminer';

const Login = () => {
  return (
    <div className="min-h-screen bg-dashboard-dark">
      {/* Header Banner */}
      <div className="w-full bg-dashboard-card/50 py-6 text-center border-b border-white/10">
        <p className="text-2xl text-white font-arabic mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="text-sm text-dashboard-text">In the name of Allah, the Most Gracious, the Most Merciful</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-6">
              Pakistan Welfare Association
            </h1>
            <p className="text-dashboard-text text-lg max-w-2xl mx-auto leading-relaxed">
              Welcome to our community platform. Please login with your member number.
            </p>
          </div>

          {/* Form and Information Sections */}
          <div className="space-y-8">
            <LoginForm />
            <CommitteeUpdate />
            <MembershipExpectations />
            <ImportantInformation />
            <MedicalExaminer />
          </div>

          {/* Footer */}
          <footer className="text-center text-dashboard-muted text-sm py-12 space-y-2">
            <p>© 2024 SmartFIX Tech, Burton Upon Trent. All rights reserved.</p>
            <p>Website created and coded by Zaheer Asghar</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;