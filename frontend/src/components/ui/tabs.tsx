"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

/**
 * Cyberpunk Tabs.
 * - TabsList: dark bar, border-border bottom line, no rounded pill
 * - TabsTrigger: font-label uppercase monospace; active: accent border-b-2 + text-accent
 * - TabsContent: token-palette styled, focus ring
 */

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-0",
      // Dark background bar
      "bg-card border-b border-border",
      // Full width
      "w-full",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Layout
      "inline-flex items-center justify-center px-4 py-2.5 min-h-11",
      // Typography — monospace uppercase
      "font-label text-xs uppercase tracking-wider",
      // Default state
      "text-muted-foreground border-b-2 border-transparent",
      "bg-transparent",
      // Transition
      "transition-all duration-150 motion-reduce:transition-none",
      // Hover
      "hover:text-foreground hover:bg-accent/5",
      // Active / selected
      "data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent",
      // Focus ring — accessible
      "focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "focus-visible:[box-shadow:var(--box-shadow-neon-sm)]",
      // Disabled
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4",
      // Focus ring on the content panel itself
      "focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
