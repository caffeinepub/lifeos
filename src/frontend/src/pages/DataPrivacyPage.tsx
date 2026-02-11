import { useState } from 'react';
import { clearLocalEvents } from '../usage/storage/localEventStore';
import { useLocalEncryptionSetting } from '../privacy/encryption/useLocalEncryptionSetting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Shield, Database, Lock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DataPrivacyPage() {
  const { encryptionEnabled, setEncryptionEnabled } = useLocalEncryptionSetting();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearData = () => {
    clearLocalEvents();
    setShowClearDialog(false);
    toast.success('Local data cleared successfully');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data & Privacy</h1>
        <p className="text-muted-foreground">Understand and control your data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            What We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>We collect:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Your interactions within the LifeOS web app (page visits, button clicks)</li>
            <li>Session timing and duration data</li>
            <li>Context tags you manually assign to sessions</li>
            <li>Your display name (for personalization)</li>
          </ul>
          <p className="mt-4"><strong>We do NOT collect:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Android or iOS system-level app usage data</li>
            <li>Device-wide screen time or app switching data</li>
            <li>System notifications or calls</li>
            <li>Any data from apps outside LifeOS</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Local-First + Sync Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            LifeOS uses a local-first architecture. Your usage events are stored in your browser first,
            then synced to the backend when you're online and authenticated.
          </p>
          <p>
            This ensures your data is always available offline and gives you full control over what gets synced.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Local Storage Encryption
          </CardTitle>
          <CardDescription>
            Encrypt locally stored event data using Web Crypto API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="encryption">Enable Local Encryption</Label>
            <Switch
              id="encryption"
              checked={encryptionEnabled}
              onCheckedChange={(checked) => {
                setEncryptionEnabled(checked);
                toast.success(checked ? 'Encryption enabled' : 'Encryption disabled');
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            When enabled, event data stored in your browser is encrypted. This adds an extra layer of security
            but may slightly impact performance.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Clear Local Data
          </CardTitle>
          <CardDescription>
            Permanently delete all locally stored events from this browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Clear All Local Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all locally stored events from this browser.
                  Synced data on the backend will not be affected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData}>Clear Data</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
