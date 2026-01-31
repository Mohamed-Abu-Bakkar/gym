import { createFileRoute } from '@tanstack/react-router'
import {
  User,
  Bell,
  Info,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/app/_user/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-muted-foreground">
          Manage your profile and settings
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-sm text-muted-foreground">
                Member since Jan 2026
              </p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">24</div>
              <div className="text-xs text-muted-foreground">Workouts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">18h</div>
              <div className="text-xs text-muted-foreground">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">6.2k</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Manage notification preferences
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* About Description */}
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are an elite fitness destination dedicated to sculpting bodies
              and minds. Our state-of-the-art facility and expert guidance
              ensure you surpass your limits.
            </p>
          </div>

          {/* CEO Section */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">CEO Nagaraj</h3>
                <p className="text-sm text-muted-foreground">
                  Founder & Head Coach
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              With over 15 years of experience in strength training and
              nutrition, Nagaraj has transformed over 500+ lives. A certified
              master trainer and nutrition specialist dedicated to excellence.
            </p>
          </div>

          {/* Success Stories */}
          <div>
            <h3 className="font-semibold mb-3">Success Stories</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-chart-1/20 to-chart-1/5 flex items-center justify-center border">
                <div className="text-center p-2">
                  <div className="text-xs font-medium">12 Week</div>
                  <div className="text-xs text-muted-foreground">Cut</div>
                </div>
              </div>
              <div className="aspect-square rounded-lg bg-gradient-to-br from-chart-2/20 to-chart-2/5 flex items-center justify-center border">
                <div className="text-center p-2">
                  <div className="text-xs font-medium">Muscle</div>
                  <div className="text-xs text-muted-foreground">Gain</div>
                </div>
              </div>
              <div className="aspect-square rounded-lg bg-gradient-to-br from-chart-3/20 to-chart-3/5 flex items-center justify-center border">
                <div className="text-center p-2">
                  <div className="text-xs font-medium">Post</div>
                  <div className="text-xs text-muted-foreground">Pregnancy</div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-chart-3" />
              </div>
              <div className="text-left">
                <div className="font-medium">Gym Information</div>
                <div className="text-xs text-muted-foreground">
                  Hours, location, and contact
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Gym Details */}
          <div className="p-4 rounded-lg bg-muted/30 space-y-3 text-sm">
            <div>
              <div className="font-semibold mb-1">Master Gym</div>
              <div className="text-muted-foreground">
                Your premier fitness destination
              </div>
            </div>

            <div>
              <div className="font-medium mb-1">Hours</div>
              <div className="text-muted-foreground">
                Mon - Fri: 5:00 AM - 11:00 PM
                <br />
                Sat - Sun: 7:00 AM - 9:00 PM
              </div>
            </div>

            <div>
              <div className="font-medium mb-1">Location</div>
              <div className="text-muted-foreground">
                123 Fitness Street
                <br />
                New York, NY 10001
              </div>
            </div>

            <div>
              <div className="font-medium mb-1">Contact</div>
              <div className="text-muted-foreground">
                Phone: (555) 987-6543
                <br />
                Email: info@mastergym.com
              </div>
            </div>

            <div>
              <div className="font-medium mb-1">Amenities</div>
              <div className="text-muted-foreground">
                • Free weights & machines
                <br />
                • Cardio equipment
                <br />
                • Group classes
                <br />
                • Personal training
                <br />
                • Locker rooms & showers
                <br />• Free parking
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="space-y-2">
        <button className="w-full p-3 rounded-lg border text-left hover:bg-muted/50 transition-colors">
          <div className="text-sm font-medium">Privacy Policy</div>
        </button>
        <button className="w-full p-3 rounded-lg border text-left hover:bg-muted/50 transition-colors">
          <div className="text-sm font-medium">Terms of Service</div>
        </button>
        <div className="text-center text-xs text-muted-foreground py-2">
          Version 1.0.0
        </div>
      </div>

      {/* Logout Button */}
      <Button variant="destructive" className="w-full" size="lg">
        <LogOut className="w-5 h-5 mr-2" />
        Logout
      </Button>

      {/* Extra padding for bottom nav */}
      <div className="h-4" />
    </div>
  )
}
