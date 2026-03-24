# Jagowelfare (JYF)

This project is built with React and uses **Supabase** for its backend (Auth, Database, and Storage).

## Getting Started

### 1) Environment Setup

1.  Copy `.env.example` to a new file named `.env`.
2.  Fill in your Supabase project details:
    *   `REACT_APP_SUPABASE_URL`: Your Supabase project URL.
    *   `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

### 2) Installation

```bash
npm install
```

### 3) Database Setup

Run the SQL commands from `supabase_setup.sql` in your Supabase SQL Editor to initialize the tables (`events`, `causes`, `news`, `gallery`, `team`, `testimonials`, `event_registrations`).

### 4) Storage Setup

1.  Go to the **Storage** section in your Supabase Dashboard.
2.  Create a new public bucket named **'JYF'**.

## Scripts

*   `npm start`: Runs the app in development mode.
*   `npm run build`: Builds the app for production.
*   `npm test`: Launches the test runner.

## Recent Updates

*   Removed all Firebase-related configurations.
*   Migration to Supabase is complete.
*   Event registration now uses Supabase database.
*   Admin functions (Add Cause, QR Scanner, etc.) are fully integrated with Supabase.
