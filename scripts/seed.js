#!/usr/bin/env node

/**
 * Seed Script Runner
 *
 * This script helps you seed your Convex database with sample data.
 * Run: node scripts/seed.js
 */

console.log(`
╔════════════════════════════════════════════════════════════╗
║                  DATABASE SEED SCRIPT                      ║
╚════════════════════════════════════════════════════════════╝

To seed your database with sample data:

Option 1: Via Convex Dashboard
  1. Open: https://dashboard.convex.dev
  2. Go to your deployment: "quaint-armadillo-624"
  3. Navigate to "Functions" tab
  4. Find "seed:seedDatabase" 
  5. Click "Run" button

Option 2: Via Your App UI
  Add this component to your app temporarily:

  import { useMutation } from 'convex/react'
  import { api } from '../convex/_generated/api'
  
  function SeedButton() {
    const seed = useMutation(api.seed.seedDatabase)
    const clear = useMutation(api.seed.clearDatabase)
    
    return (
      <div>
        <button onClick={() => seed()}>Seed Database</button>
        <button onClick={() => clear()}>Clear Database</button>
      </div>
    )
  }

Sample Login Credentials (after seeding):
  
  Admin:
    Phone: 1000000000
    PIN:   000000
  
  Trainer:
    Phone: 1111111111
    PIN:   111111
  
  Client 1 (Sarah - Weight Loss):
    Phone: 2222222222
    PIN:   222222
  
  Client 2 (Mike - Muscle Gain):
    Phone: 3333333333
    PIN:   333333
  
  Client 3 (Emma - Endurance):
    Phone: 4444444444
    PIN:   444444

For more details, see: BACKEND_INTEGRATION.md
`)
