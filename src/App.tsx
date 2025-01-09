import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useAuthSession } from "@/hooks/useAuthSession";
import ProtectedRoutes from "@/components/routing/ProtectedRoutes";

function App() {
  const { session, loading } = useAuthSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard-dark">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <ProtectedRoutes session={session} />
      <Toaster />
    </>
  );
}

export default App;