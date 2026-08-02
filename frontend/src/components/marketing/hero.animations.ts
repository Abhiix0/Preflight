/**
 * hero.animations.ts
 *
 * Animation logic for the Hero section has moved to:
 *   frontend/src/components/marketing/flight/flight.animations.ts
 *
 * This file is kept as a thin re-export shim so any future tooling
 * that scans for *.animations.ts files in this directory still finds a
 * valid entry point. All animation logic lives in flight.animations.ts
 * per the isolation convention (*.animations.ts contains logic only,
 * no JSX/component code).
 */
export { buildFlightEnvironment } from "@/components/marketing/flight/flight.animations";
