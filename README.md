# SlotBook

A simple appointment booking app with Google Calendar integration, automatic Google Meet links, and email confirmations.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fadib024%2Fslotbook&env=GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REFRESH_TOKEN,GOOGLE_CALENDAR_ID,ADMIN_EMAIL,ADMIN_PASSWORD,NEXTAUTH_SECRET,NEXT_PUBLIC_APP_URL&envDescription=See%20SETUP_GUIDE.md%20for%20how%20to%20get%20these%20values&envLink=https%3A%2F%2Fgithub.com%2Fadib024%2Fslotbook%2Fblob%2Fmain%2FSETUP_GUIDE.md&project-name=slotbook&repository-name=slotbook)

## How It Works

1. **Admin** creates 30-minute "Available" slots in Google Calendar
2. **Customers** visit the booking page, pick a date and time slot
3. On booking: Google Calendar is updated, a Meet link is generated, and both parties get email confirmations
4. **Admin** views all bookings in a password-protected dashboard

## Features

- Interactive calendar with real-time slot availability
- Automatic Google Meet link generation
- Email confirmations for customer and admin
- Admin dashboard with all bookings
- Double-booking protection
- Mobile responsive design
- No database required (Google Calendar is the data store)

## Quick Deploy

1. Click the **"Deploy with Vercel"** button above
2. Fill in the environment variables (see [SETUP_GUIDE.md](./SETUP_GUIDE.md) for details)
3. Deploy!

## Setup Guide

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for the complete step-by-step setup instructions including:

- Google Cloud Console setup
- OAuth credentials and refresh token generation
- Vercel deployment
- Environment variables reference
- Troubleshooting

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `GOOGLE_REFRESH_TOKEN` | Google API refresh token (from oauth-setup.js) |
| `GOOGLE_CALENDAR_ID` | Google Calendar ID (usually your Gmail) |
| `ADMIN_EMAIL` | Admin email for notifications |
| `ADMIN_PASSWORD` | Admin dashboard login password |
| `NEXTAUTH_SECRET` | Random string for session signing |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL |

## Local Development

```bash
npm install
cp .env.example .env    # Fill in your values
npm run dev             # Starts on http://localhost:3000
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Calendar API
- Gmail API
- JWT Authentication
