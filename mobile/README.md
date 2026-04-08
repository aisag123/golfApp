# Mobile (iOS) Wrapper

This folder now contains a Capacitor scaffold for wrapping the hosted web app.

## What it does

- Uses your live app URL: `https://golfapp-1-o233.onrender.com`
- Lets you generate an iOS project from this repository

## Setup

1. Install dependencies in this folder:
   - `npm install`
2. Generate iOS project:
   - `npm run cap:add:ios`
3. Sync config/plugins:
   - `npm run cap:sync`
4. Open in Xcode (on macOS):
   - `npm run cap:open:ios`

## Notes

- iOS build/signing requires macOS + Xcode.
- You can override API base URL in web app for testing:
  - `localStorage.setItem('apiBaseUrl', 'http://localhost:8000')`
