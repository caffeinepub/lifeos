import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import LoginButton from './LoginButton';
import BrandHeader from '../branding/BrandHeader';

export default function RequireAuth() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <BrandHeader showHero={true} />
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to LifeOS</CardTitle>
            <CardDescription>
              Your personal AI-powered digital operating system for productivity and well-being.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Sign in to access your personalized dashboard, insights, and recommendations.
            </p>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
