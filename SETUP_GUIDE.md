# SlotBook - Complete Setup Guide

This guide walks you through setting up SlotBook for production deployment. Follow each step carefully.

---

## Prerequisites

- A Google account (Gmail) that will be used for managing bookings
- A Vercel account (free at https://vercel.com)
- Node.js installed on your computer (https://nodejs.org)

---

## Part 1: Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click the project dropdown at the top of the page (next to "Google Cloud")
3. Click **"New Project"**
4. Enter a project name (e.g., "SlotBook" or your business name)
5. Click **Create**
6. Make sure the new project is selected as the active project (check the dropdown)

### Step 2: Enable Required APIs

You need to enable two Google APIs:

**Enable Google Calendar API:**
1. Go to https://console.cloud.google.com/apis/library
2. Search for **"Google Calendar API"**
3. Click on it
4. Click the **Enable** button
5. Wait for it to enable

**Enable Gmail API:**
1. Go back to https://console.cloud.google.com/apis/library
2. Search for **"Gmail API"**
3. Click on it
4. Click the **Enable** button
5. Wait for it to enable

### Step 3: Configure OAuth Consent Screen

1. Go to https://console.cloud.google.com/apis/credentials/consent
2. Select **"External"** as the user type
3. Click **Create**
4. Fill in the required fields:
   - **App name**: Your business name (e.g., "SlotBook")
   - **User support email**: Your Gmail address
   - **Developer contact email**: Your Gmail address
5. Click **Save and Continue**
6. On the **Scopes** page:
   - Click **"Add or Remove Scopes"**
   - Search for and add these two scopes:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/gmail.send`
   - Click **Update**
7. Click **Save and Continue**
8. On the **Test Users** page:
   - Click **"+ Add Users"**
   - Enter your Gmail address (the one you'll use for managing bookings)
   - Click **Add**
9. Click **Save and Continue**
10. Click **Back to Dashboard**

### Step 4: Create OAuth Credentials

1. Go to https://console.cloud.google.com/apis/credentials
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**
4. For **Application type**, select **"Web application"**
5. Give it a name (e.g., "SlotBook")
6. Under **Authorized redirect URIs**, click **"+ Add URI"** and add:
   ```
   http://localhost:3000/oauth-callback
   ```
7. Click **Create**
8. A popup will show your credentials. **Save these values:**
   - **Client ID** (looks like: `xxxx.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxxxxxxxxx`)

> IMPORTANT: Keep these credentials safe and never share them publicly.

---

## Part 2: Generate the Refresh Token

The refresh token allows SlotBook to access your Google Calendar and send emails on your behalf.

### Step 1: Clone the Repository

Open a terminal/command prompt and run:
```bash
git clone https://github.com/adib024/slotbook.git
cd slotbook
npm install
```

### Step 2: Run the OAuth Setup Script

Run this command, replacing the placeholder values with your actual Client ID and Client Secret from Part 1:

**On Windows (Command Prompt):**
```cmd
set GOOGLE_CLIENT_ID=your-client-id-here
set GOOGLE_CLIENT_SECRET=your-client-secret-here
node oauth-setup.js
```

**On Windows (PowerShell):**
```powershell
$env:GOOGLE_CLIENT_ID="your-client-id-here"
$env:GOOGLE_CLIENT_SECRET="your-client-secret-here"
node oauth-setup.js
```

**On Mac/Linux:**
```bash
GOOGLE_CLIENT_ID="your-client-id-here" GOOGLE_CLIENT_SECRET="your-client-secret-here" node oauth-setup.js
```

### Step 3: Authorize the App

1. The script will print a URL. **Copy and open it in your browser.**
2. Sign in with the **same Google account** you added as a test user in Part 1.
3. You may see a warning: "Google hasn't verified this app" - click **Continue**
4. Grant permission for both **Google Calendar** and **Gmail**
5. You'll be redirected to a page that says "Success!"
6. Go back to your terminal - you'll see:
   ```
   === SUCCESS ===
   GOOGLE_REFRESH_TOKEN=1//0gXXXXXXXXXXXXXX
   ```
7. **Copy and save this refresh token.** You'll need it for deployment.

> NOTE: This token does not expire as long as the Google Cloud project stays active and the user doesn't revoke access. However, if it stops working, simply re-run this script to generate a new one.

---

## Part 3: Deploy to Vercel

### Step 1: Import the Repository

1. Go to https://vercel.com/new
2. Sign in with your GitHub account (or create one)
3. Click **"Import"** next to the `slotbook` repository
   - If you don't see it, click "Import Third-Party Git Repository" and paste:
     `https://github.com/adib024/slotbook`

### Step 2: Add Environment Variables

Before clicking Deploy, scroll down to **"Environment Variables"** and add each of these:

| Variable Name | Value | Description |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Your Client ID from Part 1, Step 4 | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Client Secret from Part 1, Step 4 | Google OAuth Client Secret |
| `GOOGLE_REFRESH_TOKEN` | Your token from Part 2, Step 3 | Google API refresh token |
| `GOOGLE_CALENDAR_ID` | Your Gmail address (e.g., `you@gmail.com`) | The Google Calendar to use |
| `ADMIN_EMAIL` | Your Gmail address | Receives booking notifications |
| `ADMIN_PASSWORD` | Choose a strong password | Password for the admin dashboard |
| `NEXTAUTH_SECRET` | A random string (see below) | Used for session security |
| `NEXT_PUBLIC_APP_URL` | Leave blank for now | Will be updated after deploy |

**Generating NEXTAUTH_SECRET:**
Visit https://generate-secret.vercel.app/32 and copy the generated string, or just type a long random string of letters and numbers (at least 32 characters).

### Step 3: Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 1-2 minutes)
3. Once done, you'll get a URL like `https://slotbook-abc123.vercel.app`

### Step 4: Update the App URL

1. Copy your Vercel deployment URL
2. Go to your project's **Settings** tab in Vercel
3. Click **Environment Variables**
4. Add (or edit) `NEXT_PUBLIC_APP_URL` and set it to your Vercel URL
   - Example: `https://slotbook-abc123.vercel.app`
   - Do NOT include a trailing slash
5. Go to the **Deployments** tab
6. Click the three dots (...) on the latest deployment
7. Click **Redeploy** and confirm

### Step 5: Update Google Cloud OAuth (Required!)

Go back to Google Cloud Console to allow your production URL:

1. Go to https://console.cloud.google.com/apis/credentials
2. Click on your OAuth client (the one you created in Part 1)
3. Under **Authorized JavaScript origins**, click **"+ Add URI"** and add:
   ```
   https://your-app.vercel.app
   ```
   (Replace with your actual Vercel URL)
4. Under **Authorized redirect URIs**, click **"+ Add URI"** and add:
   ```
   https://your-app.vercel.app/oauth-callback
   ```
   (Replace with your actual Vercel URL)
5. Keep the `http://localhost:3000/oauth-callback` URI (useful for local testing)
6. Click **Save**

---

## Part 4: Using SlotBook

### Creating Available Slots (Admin)

To make time slots available for booking:

1. Go to **Google Calendar** (https://calendar.google.com)
2. Click on a date and time to create a new event
3. Set the event title to **"Available"** or **"Open"**
4. Set the duration to exactly **30 minutes**
5. Save the event
6. Repeat for all the time slots you want to offer

> IMPORTANT: Slots MUST be exactly 30 minutes and the title MUST contain the word "Available" or "Open" (case doesn't matter).

### Viewing Bookings (Admin Dashboard)

1. Go to `https://your-app.vercel.app/admin/login`
2. Enter the admin password you set during deployment
3. You'll see all confirmed bookings with:
   - Customer name, email, and phone
   - Booking date and time
   - Google Meet link for the meeting

### How Bookings Work (Customer Flow)

1. Customer visits your SlotBook URL
2. They see a calendar with available dates highlighted
3. They click a date and select a time slot
4. They fill in their name, email, phone, and optional note
5. On confirmation:
   - The Google Calendar event is updated to "Booked"
   - A Google Meet link is automatically created
   - Customer receives a confirmation email with the Meet link
   - Admin receives a notification email with customer details

---

## Part 5: Custom Domain (Optional)

If you want a custom domain (e.g., `book.yourbusiness.com`):

1. In Vercel, go to your project **Settings** > **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to update your DNS records
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Add the custom domain to Google Cloud OAuth settings (both origins and redirect URIs)
6. Redeploy

---

## Troubleshooting

### "No available slots" showing on the calendar
- Make sure your calendar events have "Available" or "Open" in the title
- Make sure events are exactly 30 minutes long
- Make sure events are NOT all-day events (they need specific start/end times)
- Make sure `GOOGLE_CALENDAR_ID` matches the Gmail account where you created events

### Emails not sending
- Make sure the Gmail API is enabled in Google Cloud Console
- Make sure `ADMIN_EMAIL` matches the Gmail account that authorized the app
- Check that the refresh token is valid (re-run oauth-setup.js if needed)

### "Google hasn't verified this app" warning
- This is normal for apps in testing mode
- To remove it, you'd need to submit your app for Google's verification process
- For personal/small business use, you can safely click "Continue"

### Refresh token stopped working
- Re-run the `node oauth-setup.js` script with your credentials
- Update the `GOOGLE_REFRESH_TOKEN` in Vercel environment variables
- Redeploy the app

---

## Environment Variables Quick Reference

| Variable | What it is | Where to get it |
|---|---|---|
| `GOOGLE_CLIENT_ID` | OAuth Client ID | Google Cloud Console > Credentials |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | Google Cloud Console > Credentials |
| `GOOGLE_REFRESH_TOKEN` | API access token | Run `node oauth-setup.js` |
| `GOOGLE_CALENDAR_ID` | Calendar identifier | Usually your Gmail address |
| `ADMIN_EMAIL` | Admin notification email | Your Gmail address |
| `ADMIN_PASSWORD` | Admin dashboard password | You choose this |
| `NEXTAUTH_SECRET` | Session signing key | Any random 32+ character string |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | Your Vercel URL |
