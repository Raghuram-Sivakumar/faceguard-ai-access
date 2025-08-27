import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Enhanced Access Control
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, intelligent access management powered by advanced AI recognition technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">User Access</CardTitle>
              <CardDescription className="text-base">
                Verify your identity using AI-powered facial recognition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/user-verification')}
                className="w-full h-12 text-lg font-medium"
                size="lg"
              >
                Start Verification
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4">
                <Settings className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-semibold">Admin Panel</CardTitle>
              <CardDescription className="text-base">
                Manage users, view access logs, and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/admin-login')}
                variant="secondary"
                className="w-full h-12 text-lg font-medium"
                size="lg"
              >
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Secure • Reliable • AI-Powered
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
