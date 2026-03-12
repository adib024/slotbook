# SlotBook - Complete Setup Guide

This guide will help you set up SlotBook from scratch. Follow every step exactly as written. The entire process takes about 30-45 minutes.

**What you will need before starting:**
- A Gmail account (this will be used to manage bookings and send emails)
- A computer with internet access

**What you will set up:**
- A Google Cloud project (free) for Calendar and Email access
- The SlotBook app deployed on Vercel (free)

---

## PART 1: Install Node.js

Node.js is needed to run one setup script. You only need it once.

### Windows:
1. Go to https://nodejs.org
2. Click the big green button that says **"LTS"** (Long Term Support) to download
3. Open the downloaded file (it will be named something like `node-v20.x.x-x64.msi`)
4. Click **Next** through all the steps, keeping all defaults
5. Click **Install**, then **Finish**
6. To verify it worked:
   - Press `Windows key + R`, type `cmd`, press Enter
   - In the black window that opens, type: `node --version`
   - You should see a version number like `v20.11.0`
   - Keep this window open, you'll need it later

### Mac:
1. Go to https://nodejs.org
2. Click the big green button that says **"LTS"** to download
3. Open the downloaded `.pkg` file
4. Click **Continue** through all the steps, then **Install**
5. To verify it worked:
   - Press `Cmd + Space`, type `Terminal`, press Enter
   - In the window that opens, type: `node --version`
   - You should see a version number like `v20.11.0`
   - Keep this window open, you'll need it later

---

## PART 2: Google Cloud Console Setup

This is where you create the credentials that allow SlotBook to read your calendar and send emails.

### Step 1: Create a Google Cloud Project

1. Open your browser and go to: **https://console.cloud.google.com**
2. Sign in with the **Gmail account** you want to use for bookings
3. If this is your first time, you may see a "Terms of Service" page. Check the box and click **Agree and Continue**
4. At the very top of the page, you'll see a dropdown that might say "Select a project" or show a project name. Click on it
5. In the popup that appears, click **NEW PROJECT** (top right of the popup)
6. For "Project name", type: `SlotBook`
7. Leave "Organization" and "Location" as they are
8. Click **CREATE**
9. Wait a few seconds. You may see a notification at the top right. Click **SELECT PROJECT** in that notification, OR click the project dropdown again and select **SlotBook**

**Verify:** The dropdown at the top should now show "SlotBook"

### Step 2: Enable Google Calendar API

1. Go to: **https://console.cloud.google.com/apis/library**
2. Make sure "SlotBook" is selected as the project (check the dropdown at the top)
3. In the search bar, type: `Google Calendar API`
4. Click on the result that says **"Google Calendar API"** (by Google)
5. On the next page, click the blue **ENABLE** button
6. Wait for it to enable (you'll be redirected to the API overview page)

**Verify:** You should see "Google Calendar API" with a green checkmark or "API enabled" message

### Step 3: Enable Gmail API

1. Go to: **https://console.cloud.google.com/apis/library**
2. In the search bar, type: `Gmail API`
3. Click on the result that says **"Gmail API"** (by Google)
4. On the next page, click the blue **ENABLE** button
5. Wait for it to enable

**Verify:** You should see "Gmail API" with a green checkmark or "API enabled" message

### Step 4: Configure OAuth Consent Screen

This tells Google what your app is and what permissions it needs.

1. Go to: **https://console.cloud.google.com/apis/credentials/consent**
2. You'll see "User Type" selection. Select **External**
3. Click **CREATE**
4. You're now on the "Edit app registration" page. Fill in:
   - **App name**: `SlotBook` (or your business name)
   - **User support email**: Click the dropdown and select your Gmail address
   - Scroll all the way down to **Developer contact information**
   - **Email addresses**: Type your Gmail address
5. Click **SAVE AND CONTINUE**
6. You're now on the **Scopes** page:
   - Click the **ADD OR REMOVE SCOPES** button
   - In the panel that opens on the right, scroll down or use the filter/search
   - Find and check these two scopes:
     - `https://www.googleapis.com/auth/calendar` (it may show as "Google Calendar API - See, edit, share, and permanently delete all the calendars...")
     - `https://www.googleapis.com/auth/gmail.send` (it may show as "Gmail API - Send email on your behalf")
   - If you can't find them by scrolling, paste each URL into the "Manually add scopes" box at the bottom of the panel and click **ADD TO TABLE**
   - Click **UPDATE** at the bottom of the panel
7. Click **SAVE AND CONTINUE**
8. You're now on the **Test users** page:
   - Click **+ ADD USERS**
   - Type your Gmail address (the same one you're signed in with)
   - Click **ADD**
9. Click **SAVE AND CONTINUE**
10. You'll see a summary page. Click **BACK TO DASHBOARD**

**Verify:** The OAuth consent screen page should show your app name and "Testing" status

### Step 5: Create OAuth Credentials

This is where you get your Client ID and Client Secret.

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Click **+ CREATE CREDENTIALS** at the top of the page
3. From the dropdown, select **OAuth client ID**
4. For **Application type**, select **Web application**
5. For **Name**, type: `SlotBook`
6. Skip the "Authorized JavaScript origins" section for now
7. Scroll down to **Authorized redirect URIs**:
   - Click **+ ADD URI**
   - Type exactly: `http://localhost:3000/oauth-callback`
8. Click **CREATE**
9. A popup appears showing your credentials:
   - **Your Client ID** - looks like: `123456789-abcdefgh.apps.googleusercontent.com`
   - **Your Client Secret** - looks like: `GOCSPX-xxxxxxxxxxxxx`
10. **IMPORTANT: Copy both values and save them somewhere safe** (a text file, notes app, etc.)
    - You can also click **DOWNLOAD JSON** to save them as a file
11. Click **OK** to close the popup

**Verify:** You should see your new OAuth client listed on the Credentials page

---

## PART 3: Generate the Refresh Token

The refresh token lets SlotBook access your calendar without you having to sign in every time. You only need to do this once.

### Step 1: Download the Project Files

1. Go to: **https://github.com/adib024/slotbook**
2. Click the green **Code** button
3. Click **Download ZIP**
4. Find the downloaded file (usually in your Downloads folder)
5. Extract/unzip it:
   - **Windows**: Right-click the ZIP file > **Extract All** > **Extract**
   - **Mac**: Double-click the ZIP file
6. You'll get a folder called `slotbook-main`

### Step 2: Install Dependencies

Open a terminal/command prompt and navigate to the project folder:

**Windows:**
1. Press `Windows key + R`, type `cmd`, press Enter
2. Type the following commands one by one (press Enter after each):
```
cd Downloads\slotbook-main
npm install
```

If your ZIP extracted to a different location, use that path instead. For example:
```
cd Desktop\slotbook-main
npm install
```

**Mac:**
1. Press `Cmd + Space`, type `Terminal`, press Enter
2. Type the following commands one by one (press Enter after each):
```
cd ~/Downloads/slotbook-main
npm install
```

Wait for `npm install` to finish. It may take 1-2 minutes. You'll see a lot of text scrolling. That's normal. Wait until you see your cursor ready for a new command.

### Step 3: Run the OAuth Setup Script

Now run this command. **Replace the placeholder values** with your actual Client ID and Client Secret from Part 2, Step 5.

**Windows (Command Prompt):**
```
set GOOGLE_CLIENT_ID=paste-your-client-id-here
set GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
node oauth-setup.js
```

**Windows (PowerShell - if your terminal title says "PowerShell"):**
```
$env:GOOGLE_CLIENT_ID="paste-your-client-id-here"
$env:GOOGLE_CLIENT_SECRET="paste-your-client-secret-here"
node oauth-setup.js
```

**Mac/Linux:**
```
GOOGLE_CLIENT_ID="paste-your-client-id-here" GOOGLE_CLIENT_SECRET="paste-your-client-secret-here" node oauth-setup.js
```

**Example (Windows Command Prompt):**
```
set GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
set GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
node oauth-setup.js
```

### Step 4: Authorize in Your Browser

After running the script, you'll see something like:
```
=== SlotBook OAuth Setup ===

1. Open this URL in your browser:

https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=...

2. Authorize with your Google account.
3. You will be redirected. The token will appear here.

Waiting for authorization...
```

1. **Copy the entire URL** that the script printed (it's very long, make sure you copy ALL of it)
2. **Paste it in your browser** and press Enter
3. Sign in with the **same Gmail account** you used in Part 2
4. You'll see a warning: **"Google hasn't verified this app"**
   - Click **Continue** (this is safe - it's your own app)
5. You'll see permission requests for Calendar and Gmail
   - Click **Allow** for each one
   - On the final screen, click **Allow** again
6. Your browser will show: **"Success! Check your terminal for the refresh token."**

### Step 5: Copy the Refresh Token

Go back to your terminal. You should see:
```
=== SUCCESS ===

Add this to your .env.local file:

GOOGLE_REFRESH_TOKEN=1//0gXXXXXXXXXXXXXX

===============
```

**Copy the entire refresh token** (everything after `GOOGLE_REFRESH_TOKEN=`). Save it with your Client ID and Client Secret.

**Verify:** You should now have three values saved:
- Client ID
- Client Secret
- Refresh Token

You can now close the terminal.

---

## PART 4: Generate a Secret Key

SlotBook needs a random secret key for security (session signing). This has nothing to do with Google.

1. Go to: **https://generate-secret.vercel.app/32**
2. The page will show a random string of characters
3. **Copy this string** and save it with your other credentials

You should now have four values saved:
- Client ID
- Client Secret
- Refresh Token
- Secret Key (the random string you just generated)

---

## PART 5: Deploy to Vercel

Vercel is a free hosting platform that will run your SlotBook app.

### Step 1: Create a Vercel Account

1. Go to: **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub**
   - If you don't have a GitHub account, click **Continue with Email** instead
4. Complete the sign-up process

### Step 2: Deploy with One Click

1. Go to the SlotBook repository: **https://github.com/adib024/slotbook**
2. Scroll down to the README
3. Click the **"Deploy with Vercel"** button (it's a black button near the top)
4. If asked, authorize Vercel to access your GitHub account
5. You'll be taken to Vercel's "Create Git Repository" page:
   - Choose your GitHub account
   - Repository name: `slotbook` (or any name you prefer)
   - Click **Create**

### Step 3: Fill in Environment Variables

Vercel will now ask you to fill in environment variables. Enter each one:

| Variable Name | What to Enter |
|---|---|
| `GOOGLE_CLIENT_ID` | Your Client ID from Part 2 |
| `GOOGLE_CLIENT_SECRET` | Your Client Secret from Part 2 |
| `GOOGLE_REFRESH_TOKEN` | Your Refresh Token from Part 3 |
| `GOOGLE_CALENDAR_ID` | Your Gmail address (e.g., `yourname@gmail.com`) |
| `ADMIN_EMAIL` | Your Gmail address (same as above) |
| `ADMIN_PASSWORD` | Choose a password for the admin dashboard (remember this!) |
| `NEXTAUTH_SECRET` | The random string from Part 4 |
| `NEXT_PUBLIC_APP_URL` | Leave this **empty** for now |

For each variable:
1. Click on the variable name or the input field
2. Paste or type the value
3. Make sure there are no extra spaces before or after the value

### Step 4: Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 1-2 minutes)
3. You'll see a "Congratulations!" page with confetti
4. Your app URL will be shown, something like: `https://slotbook-abc123.vercel.app`
5. **Copy this URL** - you need it for the next steps

### Step 5: Update the App URL

1. In Vercel, click on your project name to go to the project dashboard
2. Click **Settings** (in the top navigation bar)
3. Click **Environment Variables** (in the left sidebar)
4. Find `NEXT_PUBLIC_APP_URL` and click the three dots (...) next to it, then **Edit**
   - If it doesn't exist, click **Add New** and type `NEXT_PUBLIC_APP_URL` as the name
5. Set the value to your Vercel URL (e.g., `https://slotbook-abc123.vercel.app`)
   - **Do NOT** include a trailing slash (no `/` at the end)
6. Click **Save**
7. Now you need to redeploy for this change to take effect:
   - Click **Deployments** in the top navigation bar
   - Find the most recent deployment
   - Click the three dots (...) on the right side of it
   - Click **Redeploy**
   - In the popup, click **Redeploy** again to confirm
   - Wait for it to finish (1-2 minutes)

### Step 6: Update Google Cloud OAuth Settings

Your production app needs to be registered with Google:

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Make sure your "SlotBook" project is selected
3. Click on the OAuth client ID you created (under "OAuth 2.0 Client IDs")
4. Under **Authorized JavaScript origins**:
   - Click **+ ADD URI**
   - Type your Vercel URL (e.g., `https://slotbook-abc123.vercel.app`)
5. Under **Authorized redirect URIs**:
   - Click **+ ADD URI**
   - Type your Vercel URL followed by `/oauth-callback`
   - Example: `https://slotbook-abc123.vercel.app/oauth-callback`
   - **Keep** the existing `http://localhost:3000/oauth-callback` entry (don't delete it)
6. Click **SAVE**

**Verify:** Open your Vercel URL in a browser. You should see the SlotBook calendar!

---

## PART 6: Start Using SlotBook

### How to Create Bookable Time Slots

You create available time slots directly in Google Calendar. SlotBook reads them automatically.

1. Go to **https://calendar.google.com**
2. Sign in with the same Gmail account you used during setup
3. Click on a **future date** in the calendar
4. A small event creation popup will appear:
   - **Title**: Type exactly `Available` (or `Open`) - this keyword is required
   - Click **"More options"** to open the full editor
5. In the full editor:
   - Make sure the **start time** is correct
   - Set the **end time** to exactly **30 minutes** after the start time
   - Example: Start 10:00 AM, End 10:30 AM
   - **IMPORTANT**: The slot MUST be exactly 30 minutes. Not 15 min, not 1 hour - exactly 30 minutes
6. Click **Save**

**To create multiple slots quickly:**
- Create one slot, then click on the next time and repeat
- Example: Create slots at 10:00-10:30, 10:30-11:00, 11:00-11:30, etc.

**Rules for slots:**
- Title MUST contain the word **"Available"** or **"Open"** (capitalization doesn't matter)
- Duration MUST be exactly **30 minutes**
- Must NOT be an all-day event (must have specific start and end times)
- Must be on a **future** date

### How Customers Book a Slot

1. Customer visits your SlotBook URL (your Vercel URL)
2. They see a monthly calendar
3. Dates with available slots are highlighted
4. They click a date to see available time slots
5. They select a time slot
6. They fill in their details:
   - Full Name (required)
   - Email Address (required)
   - Phone Number (required)
   - Note/Message (optional)
7. They click **Book**
8. On success:
   - The calendar event changes from "Available" to "Booked - [Customer Name]"
   - A **Google Meet link** is automatically created for the meeting
   - **Customer** receives a confirmation email with the Meet link
   - **You (admin)** receive a notification email with the customer's details and Meet link

### How to View Bookings (Admin Dashboard)

1. Go to: `https://your-vercel-url.vercel.app/admin/login`
2. Enter the admin password you chose during deployment
3. Click **Sign in**
4. You'll see all confirmed bookings with:
   - Customer name, email, and phone number
   - Booking date and time
   - Customer's note (if any)
   - Google Meet link for the meeting
5. Your admin session lasts 24 hours. After that, you'll need to sign in again.

---

## PART 7: Custom Domain (Optional)

If you want your app at a custom URL like `book.yourbusiness.com`:

1. Buy a domain from a registrar (Namecheap, GoDaddy, Google Domains, etc.)
2. In Vercel:
   - Go to your project **Settings** > **Domains**
   - Type your domain and click **Add**
   - Vercel will show you DNS records to add
3. In your domain registrar:
   - Go to DNS settings
   - Add the records Vercel showed you (usually a CNAME record)
   - Wait 10-30 minutes for DNS to propagate
4. Back in Vercel:
   - Click **Refresh** to verify the domain is connected
5. Update `NEXT_PUBLIC_APP_URL`:
   - Go to Settings > Environment Variables
   - Change `NEXT_PUBLIC_APP_URL` to `https://book.yourbusiness.com` (your custom domain)
   - Redeploy (Deployments > three dots > Redeploy)
6. Update Google Cloud:
   - Go to https://console.cloud.google.com/apis/credentials
   - Add your custom domain to both:
     - Authorized JavaScript origins: `https://book.yourbusiness.com`
     - Authorized redirect URIs: `https://book.yourbusiness.com/oauth-callback`

---

## Troubleshooting

### Problem: "No available slots on this date"

**Possible causes:**
- You haven't created any "Available" or "Open" events on that date
- Your events are not exactly 30 minutes long
- Your events are all-day events instead of having specific times
- The event title doesn't contain "Available" or "Open"

**Fix:** Go to Google Calendar and create events with the title "Available" that are exactly 30 minutes long with specific start and end times.

### Problem: Booking works but no email received

**Possible causes:**
- Check your spam/junk folder
- The Gmail API might not be enabled
- The refresh token might be invalid

**Fix:**
1. Verify Gmail API is enabled at https://console.cloud.google.com/apis/library
2. If needed, regenerate the refresh token (re-run oauth-setup.js) and update it in Vercel

### Problem: "Google hasn't verified this app" warning

**This is normal.** Since the app is in "Testing" mode in Google Cloud, users will see this warning. It's safe to click "Continue" since it's your own app.

To remove this warning permanently, you would need to submit your app for Google's verification process (requires a privacy policy, terms of service, etc.). For personal or small business use, the warning is fine.

### Problem: Admin dashboard shows no bookings

**Possible causes:**
- No one has booked a slot yet
- You're signed into the wrong Gmail account
- The admin dashboard only shows bookings from the past 3 months

**Fix:** Try booking a test slot yourself from the main page, then check the admin dashboard.

### Problem: Refresh token stopped working

Refresh tokens can occasionally expire if:
- You change your Google password
- You revoke access from Google Account settings
- The Google Cloud project is deleted

**Fix:** Re-run the `node oauth-setup.js` script (Part 3 of this guide) to generate a new token, then update `GOOGLE_REFRESH_TOKEN` in Vercel > Settings > Environment Variables, and redeploy.

### Problem: Vercel build fails

**Possible causes:**
- Missing environment variables
- Typo in an environment variable value

**Fix:** Go to Vercel > Settings > Environment Variables and double-check all values. Make sure there are no extra spaces, and that you've entered all 8 variables. Then try redeploying.

---

## Quick Reference: All Credentials You Need

| # | Credential | Where You Get It | What It Looks Like |
|---|---|---|---|
| 1 | Google Client ID | Google Cloud Console > Credentials | `123456789012-abcdefg.apps.googleusercontent.com` |
| 2 | Google Client Secret | Google Cloud Console > Credentials | `GOCSPX-xxxxxxxxxxxxxxxx` |
| 3 | Google Refresh Token | Running `node oauth-setup.js` | `1//0gXXXXXXXXXXXXXXXXXX` |
| 4 | Google Calendar ID | Your Gmail address | `yourname@gmail.com` |
| 5 | Admin Email | Your Gmail address | `yourname@gmail.com` |
| 6 | Admin Password | You choose this | Any password you want |
| 7 | NextAuth Secret | https://generate-secret.vercel.app/32 | Random string of characters |
| 8 | App URL | Your Vercel deployment URL | `https://slotbook-xyz.vercel.app` |

---

## Summary Checklist

Use this checklist to track your progress:

- [ ] Installed Node.js
- [ ] Created Google Cloud project
- [ ] Enabled Google Calendar API
- [ ] Enabled Gmail API
- [ ] Configured OAuth consent screen
- [ ] Added yourself as a test user
- [ ] Created OAuth credentials (got Client ID and Client Secret)
- [ ] Downloaded project files
- [ ] Ran `npm install`
- [ ] Ran `oauth-setup.js` (got Refresh Token)
- [ ] Generated a secret key
- [ ] Created Vercel account
- [ ] Clicked "Deploy with Vercel" button
- [ ] Entered all 8 environment variables
- [ ] Deployed successfully
- [ ] Updated `NEXT_PUBLIC_APP_URL` with Vercel URL
- [ ] Redeployed after updating URL
- [ ] Added Vercel URL to Google Cloud OAuth settings
- [ ] Created first available time slots in Google Calendar
- [ ] Tested booking a slot
- [ ] Checked admin dashboard
- [ ] Verified confirmation emails received
