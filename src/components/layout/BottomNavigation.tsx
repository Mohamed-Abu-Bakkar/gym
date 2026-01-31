import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Home,
  Dumbbell,
  Plus,
  FileText,
  User,
  UtensilsCrossed,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'

interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

const navItems: NavItem[] = [
  { to: '/app', icon: Home, label: 'Dashboard' },
  { to: '/app/workouts', icon: Dumbbell, label: 'Workouts' },
]

const navItemsRight: NavItem[] = [
  { to: '/app/logs', icon: FileText, label: 'Logs' },
  { to: '/app/account', icon: User, label: 'Account' },
]

export function BottomNavigation() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const router = useRouterState()
  const currentPath = router.location.pathname

  const isActive = (path: string) => {
    if (path === '/app') {
      return currentPath === '/app' || currentPath === '/app/'
    }
    return currentPath.startsWith(path)
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-screen-sm mx-auto px-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs transition-colors',
                isActive(item.to)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs transition-colors hover:text-foreground"
          >
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Plus className="w-6 h-6" />
            </div>
          </button>

          {navItemsRight.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs transition-colors',
                isActive(item.to)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Quick Actions</DrawerTitle>
            <DrawerDescription>
              Start a new workout or log your progress
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-3 p-6">
            <Link to="/app/workouts">
              <Button
                variant="outline"
                className="w-full h-16 text-lg justify-start gap-4"
                onClick={() => setDrawerOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Start New Workout</div>
                  <div className="text-sm text-muted-foreground">
                    Begin today's training
                  </div>
                </div>
              </Button>
            </Link>

            <Link to="/app/diet-plans/new">
              <Button
                variant="outline"
                className="w-full h-16 text-lg justify-start gap-4"
                onClick={() => setDrawerOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Create Diet Plan</div>
                  <div className="text-sm text-muted-foreground">
                    Build a multi-day template
                  </div>
                </div>
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full h-16 text-lg justify-start gap-4"
              onClick={() => setDrawerOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-chart-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Log Weight</div>
                <div className="text-sm text-muted-foreground">
                  Track your progress
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 text-lg justify-start gap-4"
              onClick={() => setDrawerOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-chart-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Log Diet</div>
                <div className="text-sm text-muted-foreground">
                  Record your meals
                </div>
              </div>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
