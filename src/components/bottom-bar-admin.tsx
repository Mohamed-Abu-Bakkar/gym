import { useState, type ComponentType } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Activity,
  ClipboardList,
  Menu,
  NotebookPen,
  Plus,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

type AdminNavItem = {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
}

const primaryNav: AdminNavItem[] = [
  { to: '/app/management', label: 'Overview', icon: Activity },
  { to: '/app/management/clients', label: 'Clients', icon: Users },
]

const secondaryNav: AdminNavItem[] = [
  { to: '/app/management/programs', label: 'Programs', icon: ClipboardList },
  { to: '/app/management/more', label: 'More', icon: Menu },
]

interface BottomBarAdminProps {
  showUserIndicator?: boolean
  onPrimaryClick?: () => void
}

export function BottomBarAdmin({
  showUserIndicator = false,
  onPrimaryClick,
}: BottomBarAdminProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const router = useRouterState()
  const currentPath = router.location.pathname

  const isActive = (path: string) => {
    if (path === '/app/management') {
      return (
        currentPath === '/app/management' || currentPath === '/app/management/'
      )
    }
    return currentPath.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-screen-sm mx-auto px-2">
        {primaryNav.map((item) => (
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
          type="button"
          aria-label={
            onPrimaryClick ? 'Trigger primary action' : 'Open quick actions'
          }
          onClick={() => {
            if (onPrimaryClick) {
              onPrimaryClick()
              return
            }
            setDrawerOpen(true)
          }}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs transition-colors hover:text-foreground"
        >
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Plus className="w-6 h-6" />
          </div>
        </button>

        {secondaryNav.map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'relative flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs transition-colors',
              isActive(item.to)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {showUserIndicator && index === secondaryNav.length - 1 && (
              <span className="absolute -top-1 right-5 h-2 w-2 rounded-full bg-emerald-400" />
            )}
          </Link>
        ))}
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Launch quick action</DrawerTitle>
            <DrawerDescription>
              Spin up a workflow without leaving this view.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-3 p-6">
            <Link to="/app/management/clients">
              <Button
                variant="outline"
                className="w-full h-16 justify-start gap-4"
                onClick={() => setDrawerOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Start roster check-in</p>
                  <p className="text-sm text-muted-foreground">
                    Jump into active clients list.
                  </p>
                </div>
              </Button>
            </Link>

            <Link to="/app/management/programs">
              <Button
                variant="outline"
                className="w-full h-16 justify-start gap-4"
                onClick={() => setDrawerOpen(false)}
              >
                <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-chart-2" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Assign or edit program</p>
                  <p className="text-sm text-muted-foreground">
                    Open the program shelf.
                  </p>
                </div>
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full h-16 justify-start gap-4"
              onClick={() => setDrawerOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center">
                <NotebookPen className="w-5 h-5 text-chart-4" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Log internal note</p>
                <p className="text-sm text-muted-foreground">
                  Record ops updates for later.
                </p>
              </div>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  )
}
