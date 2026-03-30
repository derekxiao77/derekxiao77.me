# PupTrack

Smart puppy potty training for your household. Like Whoop meets Strava for your puppy's housetraining.

## Features

- **Potty Risk Score** — Glanceable gauge showing if your puppy needs to go out
- **Strava-style Walk Tracking** — One-tap start, GPS route, distance & duration
- **Quick Event Logging** — Tap to log meals, pees, poops, accidents, and naps
- **Shared Household** — Real-time sync between partners/household members
- **Meal-to-Poop Engine** — Learns your dog's gastrocolic reflex interval
- **Analytics & Patterns** — Weekly reports, hourly heatmaps, maturation trends
- **Accident-Free Streak** — Motivational progress tracking

## Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google sign-in) and Firestore
3. Copy your Firebase config to `src/firebase.ts`
4. `npm install && npm run dev`

## Tech Stack

React + TypeScript, Vite, Tailwind CSS, Firebase, Leaflet, Recharts
