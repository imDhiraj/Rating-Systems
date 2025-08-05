import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Home } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      navigate('/login');
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'owner':
        return '/owner-dashboard';
      default:
        return '/user-dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Rating System</h1>
            {user && (
              <nav className="flex space-x-4">
                <Link to={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                {user.role === 'user' && (
                  <Link to="/stores">
                    <Button variant="ghost" size="sm">
                      Stores
                    </Button>
                  </Link>
                )}
              </nav>
            )}
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {user.name} ({user.role})
                </span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};