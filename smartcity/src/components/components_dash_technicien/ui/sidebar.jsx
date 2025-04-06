import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              }
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              }
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-[60px] items-center px-6", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-[60px] items-center px-6", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarMain = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
))
SidebarMain.displayName = "SidebarMain"

const SidebarNav = React.forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("flex flex-col gap-1 p-4", className)}
    {...props}
  />
))
SidebarNav.displayName = "SidebarNav"

const SidebarNavHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 px-2", className)}
    {...props}
  />
))
SidebarNavHeader.displayName = "SidebarNavHeader"

const SidebarNavTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold text-muted-foreground", className)}
    {...props}
  />
))
SidebarNavTitle.displayName = "SidebarNavTitle"

const SidebarNavContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
))
SidebarNavContent.displayName = "SidebarNavContent"

const SidebarNavItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", className)}
    {...props}
  />
))
SidebarNavItem.displayName = "SidebarNavItem"

const SidebarNavLink = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", className)}
    {...props}
  />
))
SidebarNavLink.displayName = "SidebarNavLink"

const SidebarNavButton = React.forwardRef(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn("w-full justify-start gap-2", className)}
    {...props}
  />
))
SidebarNavButton.displayName = "SidebarNavButton"

const SidebarToggle = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarToggle.displayName = "SidebarToggle"

const SidebarSearch = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 px-4", className)}
    {...props}
  />
))
SidebarSearch.displayName = "SidebarSearch"

const SidebarSearchInput = React.forwardRef(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    type="search"
    placeholder="Search..."
    className={cn("h-8", className)}
    {...props}
  />
))
SidebarSearchInput.displayName = "SidebarSearchInput"

const SidebarSearchButton = React.forwardRef(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn("h-8 w-8", className)}
    {...props}
  />
))
SidebarSearchButton.displayName = "SidebarSearchButton"

const SidebarSearchClear = React.forwardRef(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn("h-8 w-8", className)}
    {...props}
  />
))
SidebarSearchClear.displayName = "SidebarSearchClear"

const SidebarSearchResults = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 p-4", className)}
    {...props}
  />
))
SidebarSearchResults.displayName = "SidebarSearchResults"

const SidebarSearchResultItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", className)}
    {...props}
  />
))
SidebarSearchResultItem.displayName = "SidebarSearchResultItem"

const SidebarSearchResultLink = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", className)}
    {...props}
  />
))
SidebarSearchResultLink.displayName = "SidebarSearchResultLink"

const SidebarSearchResultButton = React.forwardRef(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn("w-full justify-start gap-2", className)}
    {...props}
  />
))
SidebarSearchResultButton.displayName = "SidebarSearchResultButton"

const SidebarSearchResultTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultTitle.displayName = "SidebarSearchResultTitle"

const SidebarSearchResultDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultDescription.displayName = "SidebarSearchResultDescription"

const SidebarSearchResultIcon = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-4 w-4 items-center justify-center", className)}
    {...props}
  />
))
SidebarSearchResultIcon.displayName = "SidebarSearchResultIcon"

const SidebarSearchResultImage = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-4 w-4 items-center justify-center", className)}
    {...props}
  />
))
SidebarSearchResultImage.displayName = "SidebarSearchResultImage"

const SidebarSearchResultAvatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-4 w-4 items-center justify-center", className)}
    {...props}
  />
))
SidebarSearchResultAvatar.displayName = "SidebarSearchResultAvatar"

const SidebarSearchResultBadge = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-4 w-4 items-center justify-center", className)}
    {...props}
  />
))
SidebarSearchResultBadge.displayName = "SidebarSearchResultBadge"

const SidebarSearchResultSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn("my-2", className)}
    {...props}
  />
))
SidebarSearchResultSeparator.displayName = "SidebarSearchResultSeparator"

const SidebarSearchResultEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultEmpty.displayName = "SidebarSearchResultEmpty"

const SidebarSearchResultLoading = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultLoading.displayName = "SidebarSearchResultLoading"

const SidebarSearchResultError = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultError.displayName = "SidebarSearchResultError"

const SidebarSearchResultSkeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 px-2 py-2", className)}
    {...props}
  />
))
SidebarSearchResultSkeleton.displayName = "SidebarSearchResultSkeleton"

const SidebarSearchResultSkeletonIcon = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonIcon.displayName = "SidebarSearchResultSkeletonIcon"

const SidebarSearchResultSkeletonImage = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonImage.displayName = "SidebarSearchResultSkeletonImage"

const SidebarSearchResultSkeletonAvatar = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonAvatar.displayName = "SidebarSearchResultSkeletonAvatar"

const SidebarSearchResultSkeletonBadge = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonBadge.displayName = "SidebarSearchResultSkeletonBadge"

const SidebarSearchResultSkeletonText = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-24", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonText.displayName = "SidebarSearchResultSkeletonText"

const SidebarSearchResultSkeletonDescription = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-32", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonDescription.displayName = "SidebarSearchResultSkeletonDescription"

const SidebarSearchResultSkeletonSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn("my-2", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSeparator.displayName = "SidebarSearchResultSkeletonSeparator"

const SidebarSearchResultSkeletonEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonEmpty.displayName = "SidebarSearchResultSkeletonEmpty"

const SidebarSearchResultSkeletonLoading = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonLoading.displayName = "SidebarSearchResultSkeletonLoading"

const SidebarSearchResultSkeletonError = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonError.displayName = "SidebarSearchResultSkeletonError"

const SidebarSearchResultSkeletonSkeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 px-2 py-2", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeleton.displayName = "SidebarSearchResultSkeletonSkeleton"

const SidebarSearchResultSkeletonSkeletonIcon = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonIcon.displayName = "SidebarSearchResultSkeletonSkeletonIcon"

const SidebarSearchResultSkeletonSkeletonImage = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonImage.displayName = "SidebarSearchResultSkeletonSkeletonImage"

const SidebarSearchResultSkeletonSkeletonAvatar = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonAvatar.displayName = "SidebarSearchResultSkeletonSkeletonAvatar"

const SidebarSearchResultSkeletonSkeletonBadge = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonBadge.displayName = "SidebarSearchResultSkeletonSkeletonBadge"

const SidebarSearchResultSkeletonSkeletonText = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-24", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonText.displayName = "SidebarSearchResultSkeletonSkeletonText"

const SidebarSearchResultSkeletonSkeletonDescription = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-32", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonDescription.displayName = "SidebarSearchResultSkeletonSkeletonDescription"

const SidebarSearchResultSkeletonSkeletonSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn("my-2", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSeparator.displayName = "SidebarSearchResultSkeletonSkeletonSeparator"

const SidebarSearchResultSkeletonSkeletonEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonEmpty.displayName = "SidebarSearchResultSkeletonSkeletonEmpty"

const SidebarSearchResultSkeletonSkeletonLoading = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonLoading.displayName = "SidebarSearchResultSkeletonSkeletonLoading"

const SidebarSearchResultSkeletonSkeletonError = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonError.displayName = "SidebarSearchResultSkeletonSkeletonError"

const SidebarSearchResultSkeletonSkeletonSkeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 px-2 py-2", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeleton.displayName = "SidebarSearchResultSkeletonSkeletonSkeleton"

const SidebarSearchResultSkeletonSkeletonSkeletonIcon = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonIcon.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonIcon"

const SidebarSearchResultSkeletonSkeletonSkeletonImage = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonImage.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonImage"

const SidebarSearchResultSkeletonSkeletonSkeletonAvatar = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonAvatar.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonAvatar"

const SidebarSearchResultSkeletonSkeletonSkeletonBadge = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonBadge.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonBadge"

const SidebarSearchResultSkeletonSkeletonSkeletonText = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-24", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonText.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonText"

const SidebarSearchResultSkeletonSkeletonSkeletonDescription = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-32", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonDescription.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonDescription"

const SidebarSearchResultSkeletonSkeletonSkeletonSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn("my-2", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSeparator.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonSeparator"

const SidebarSearchResultSkeletonSkeletonSkeletonEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonEmpty.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonEmpty"

const SidebarSearchResultSkeletonSkeletonSkeletonLoading = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonLoading.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonLoading"

const SidebarSearchResultSkeletonSkeletonSkeletonError = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonError.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonError"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 px-2 py-2", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeleton.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonSkeleton"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonIcon = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonIcon.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonSkeletonIcon"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonImage = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonImage.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonSkeletonImage"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonAvatar = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonAvatar.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonSkeletonAvatar"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonBadge = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-4", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonBadge.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonSkeletonBadge"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonText = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-24", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonText.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonText"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonDescription = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-4 w-32", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonDescription.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonDescription"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn("my-2", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonSeparator.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonSeparator"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonEmpty.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonEmpty"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonLoading = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonLoading.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonLoading"

const SidebarSearchResultSkeletonSkeletonSkeletonSkeletonError = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center p-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarSearchResultSkeletonSkeletonSkeletonSkeletonError.displayName = "SidebarSearchResultSkeletonSkeletonSkeletonError"

export {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarMain,
  SidebarNav,
  SidebarNavHeader,
  SidebarNavTitle,
  SidebarNavContent,
  SidebarNavItem,
  SidebarNavLink,
  SidebarNavButton,
  SidebarToggle,
  SidebarSearch,
  SidebarSearchInput,
  SidebarSearchButton,
  SidebarSearchClear,
  SidebarSearchResults,
  SidebarSearchResultItem,
  SidebarSearchResultLink,
  SidebarSearchResultButton,
  SidebarSearchResultTitle,
  SidebarSearchResultDescription,
  SidebarSearchResultIcon,
  SidebarSearchResultImage,
  SidebarSearchResultAvatar,
  SidebarSearchResultBadge,
  SidebarSearchResultSeparator,
  SidebarSearchResultEmpty,
  SidebarSearchResultLoading,
  SidebarSearchResultError,
  SidebarSearchResultSkeleton,
  SidebarSearchResultSkeletonIcon,
  SidebarSearchResultSkeletonImage,
  SidebarSearchResultSkeletonAvatar,
  SidebarSearchResultSkeletonBadge,
  SidebarSearchResultSkeletonText,
  SidebarSearchResultSkeletonDescription,
  SidebarSearchResultSkeletonSeparator,
  SidebarSearchResultSkeletonEmpty,
  SidebarSearchResultSkeletonLoading,
  SidebarSearchResultSkeletonError,
  SidebarSearchResultSkeletonSkeleton,
  SidebarSearchResultSkeletonSkeletonIcon,
  SidebarSearchResultSkeletonSkeletonImage,
  SidebarSearchResultSkeletonSkeletonAvatar,
  SidebarSearchResultSkeletonSkeletonBadge,
  SidebarSearchResultSkeletonSkeletonText,
  SidebarSearchResultSkeletonSkeletonDescription,
  SidebarSearchResultSkeletonSkeletonSeparator,
  SidebarSearchResultSkeletonSkeletonEmpty,
  SidebarSearchResultSkeletonSkeletonLoading,
  SidebarSearchResultSkeletonSkeletonError,
} 