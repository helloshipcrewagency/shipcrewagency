// Step-by-step setup guide content for connecting Google Analytics 4 + Google
// Search Console. Written to be followed by a complete beginner, in strict order.
// In step text, `backticks` mark literal button/value names and **double
// asterisks** mark emphasis; the guide component renders these inline.

export interface GuidePart {
  title: string;
  steps: string[];
}
export interface GuideEnv {
  name: string;
  desc: string;
}
export interface GuideData {
  intro: string;
  parts: GuidePart[];
  envTable: GuideEnv[];
  notes: string[];
}

export const GUIDE: GuideData = {
  "intro": "This guide connects your website's admin dashboard to Google Analytics 4 and Google Search Console so your live visitor and search statistics show up inside your own admin pages. You will do this by creating a \"service account\" -- think of it as a robot Google login that you create once and then give read-only permission to look at your stats. Your website logs in as this robot, reads the numbers, and shows them to you. You never have to share your personal Google password with the website. Follow every part below in exact order, top to bottom. Do not skip ahead. Each step tells you exactly where to go and what to click. The whole process takes about 20-30 minutes, and you only ever do it once.",
  "parts": [
    {
      "title": "Part 0 -- Before you start (what you need)",
      "steps": [
        "You need a **Google account** -- the same kind of free account you use for Gmail. If you do not have one, go to `accounts.google.com/signup` in your web browser and create one before continuing.",
        "Understand in plain words what you are about to make: a **service account** is a kind of robot Google login. It is not a person. You create it, give it a long robot email address, and then you grant that robot permission to read (only read, never change) your website's statistics. Your website quietly logs in as this robot to fetch the numbers.",
        "Your website must already be set up in **Google Analytics 4**. To check, go to `analytics.google.com` and sign in. If you see a property with your website's name and some visitor numbers, you are set. If you have **never** set this up, go to `analytics.google.com`, click `Start measuring` (or `Admin` then `Create Property`), follow the prompts to create a property for your website, and install the measurement code on your site -- then come back here.",
        "Your website must also already be set up in **Google Search Console**. To check, go to `search.google.com/search-console` and sign in. If you see your website listed as a property, you are set. If you have **never** set this up, go to `search.google.com/search-console`, click `Add property`, enter your website address, and complete the ownership verification it asks for -- then come back here.",
        "Open your web browser and make sure you are **signed in to the correct Google account** -- the one that owns the Analytics and Search Console for your website. If you have several Google accounts, this matters a lot; using the wrong one will cause confusing errors later.",
        "Have somewhere safe and private ready to temporarily store text -- for example a blank document or a password manager. You will be copying a secret key in a later step and you must not lose it or let anyone see it."
      ]
    },
    {
      "title": "Part A -- Create a Google Cloud project",
      "steps": [
        "In your web browser, go to `console.cloud.google.com` and press Enter.",
        "If you are asked to sign in, sign in with the **same Google account** that owns your Analytics and Search Console.",
        "If this is your very first time, you may see a welcome screen asking you to agree to the Terms of Service -- tick the box to agree and click `Agree and Continue`.",
        "Look at the **very top of the page**, just to the right of the words `Google Cloud`. You will see a project selector button (it may say `Select a project`, or show a project name).",
        "Click that **project selector button** at the top.",
        "In the small window that opens, click `New Project` in the top-right corner of that window.",
        "In the `Project name` box, type a simple name you will recognise, for example **Website Stats**.",
        "Leave every other setting on the page exactly as it is (you do not need to pick an organisation or change the location).",
        "Click the blue `Create` button.",
        "Wait a few seconds. A notification will appear in the top-right saying the project is being created. When it is ready, click the `Select project` link in that notification.",
        "Confirm the project name now shows in the **project selector button at the top of the page**. Everything you do from now on must happen inside this project, so keep an eye on that name staying the same."
      ]
    },
    {
      "title": "Part B -- Turn on the two required APIs",
      "steps": [
        "Make sure the **project selector at the top still shows your project** (for example `Website Stats`). If it shows a different project, click it and pick yours again before continuing.",
        "Click inside the **search bar at the very top of the page** (it has a magnifying glass and usually says `Search`).",
        "Type **Google Analytics Data API** and press Enter.",
        "In the search results, click the result named exactly `Google Analytics Data API` (this opens its information page).",
        "On that page, click the blue `Enable` button and wait a few seconds for it to finish turning on.",
        "Now click the **search bar at the top** again.",
        "Type **Google Search Console API** and press Enter.",
        "In the results, click the result named exactly `Google Search Console API`.",
        "On that page, click the blue `Enable` button and wait for it to finish.",
        "You have now switched on **both** required APIs. If either page still shows `Enable` instead of a `Manage` or `Disable` button, click `Enable` again to be sure it is on."
      ]
    },
    {
      "title": "Part C -- Create the service account and download its JSON key file",
      "steps": [
        "Click the **search bar at the top** of the page.",
        "Type **Credentials** and press Enter, then click the result `Credentials` (under `APIs & Services`). You will land on the `APIs & Services` > `Credentials` page.",
        "Near the top of this page, click the `+ Create credentials` button.",
        "In the small menu that drops down, click `Service account`.",
        "In the `Service account name` box, type a simple name such as **stats-reader**. Notice that a `Service account ID` and a long email address are filled in automatically just below -- that long email is your robot's address and you will use it soon.",
        "Click the blue `Create and continue` button.",
        "The next section is titled `Grant this service account access to project`. You do **not** need any access here, so simply click `Continue` to skip it (if there is no `Continue`, click `Done`).",
        "The last section is about granting users access -- you can skip it too. Click the `Done` button to finish creating the service account.",
        "You are now back on the `Credentials` page. Under the heading `Service Accounts`, find the robot account you just made (it will have the email starting with **stats-reader@**) and click on its name to open it.",
        "On the service account's page, click the `Keys` tab near the top.",
        "Click the `Add key` button, then in the small menu click `Create new key`.",
        "A small window appears asking for the key type. Make sure `JSON` is selected (it is the default), then click the blue `Create` button.",
        "A file will **download automatically** to your computer (usually into your `Downloads` folder). This file ends in `.json` -- this is your secret key file. Click `Close` on the window.",
        "Open that downloaded `.json` file by double-clicking it (it will open in a plain text viewer or your browser). Inside you will see lines of text. Two of them matter: one line starts with `\"client_email\":` followed by the robot email address, and one starts with `\"private_key\":` followed by a very long secret block. You will copy these in Part F.",
        "Treat this file like a password. **Never** email it, post it, or commit it to a public place. Anyone who has it can read your stats. Keep it only in a safe, private spot on your own computer."
      ]
    },
    {
      "title": "Part D -- Give the robot permission to READ Google Analytics",
      "steps": [
        "Open a new browser tab and go to `analytics.google.com`, signing in with the **same Google account** if asked.",
        "At the bottom-left of the screen, click the gear icon labelled `Admin`.",
        "In the Admin area, make sure the **correct property** (your website) is selected in the property column. The property name is shown near the middle column; if you have more than one, click the dropdown and choose the one for your website.",
        "In that same middle `Property` column, click `Property Access Management`.",
        "On the `Property Access Management` page, click the blue `+` button in the top-right corner, then click `Add users`.",
        "In the `Email addresses` box, **paste the robot's client_email** -- the address starting with `stats-reader@` that you saw in the JSON file (copy it exactly, with no extra spaces).",
        "Look at the list of roles below. Choose the `Viewer` role (this lets the robot read but never change anything). Make sure only `Viewer` is selected.",
        "If there is a tickbox labelled `Notify new users by email`, **untick it** -- the robot has no inbox and does not need an email.",
        "Click the blue `Add` button in the top-right to save.",
        "Confirm the robot's email now appears in the list of people with access, showing the `Viewer` role."
      ]
    },
    {
      "title": "Part E -- Give the robot permission to READ Search Console",
      "steps": [
        "Open a new browser tab and go to `search.google.com/search-console`, signing in with the **same Google account** if asked.",
        "Make sure the **correct website** is chosen in the property selector at the **top-left** of the page; if you manage several sites, click it and pick the right one.",
        "In the **left-hand menu**, scroll to the bottom and click `Settings`.",
        "On the Settings page, click the row called `Users and permissions`.",
        "On the `Users and permissions` page, click the blue `Add user` button in the top-right.",
        "In the `Email address` box, **paste the same robot client_email** (the address starting with `stats-reader@`) exactly as before.",
        "For `Permission`, click the dropdown and choose `Full`.",
        "Click the blue `Add` button to save.",
        "Confirm the robot's email now appears in the users list with `Full` permission."
      ]
    },
    {
      "title": "Part F -- Collect the four values you will need",
      "steps": [
        "First, get the **GA4 Property ID**. Go back to the `analytics.google.com` tab and click the `Admin` gear at the bottom-left again.",
        "In the middle `Property` column, click `Property Settings` (sometimes shown as `Property details`).",
        "Near the top of that page you will see a `PROPERTY ID` -- it is a number made of **digits only**, for example `123456789`. Copy that number and save it somewhere safe; this is your **GA4_PROPERTY_ID**.",
        "**Important:** do NOT use the code that looks like `G-XXXXXXXXXX` -- that one (called the Measurement ID) is the wrong value. You want the all-digits Property ID only.",
        "Next, get the **Search Console site URL**. Go to your `search.google.com/search-console` tab and look at the property selector at the top-left -- it shows exactly how your site is registered.",
        "If your site is registered as a **URL-prefix** property, the value is the full web address **with the trailing slash**, for example `https://www.example.com/`. Copy it exactly as Search Console shows it, including `https://`, any `www`, and the final `/`. This is your **GSC_SITE_URL**.",
        "If instead your site is registered as a **Domain** property, the value must be written in the special form `sc-domain:example.com` (the words `sc-domain:` followed by your bare domain, with no `https://` and no slash). Use that as your **GSC_SITE_URL**.",
        "Now get the **client_email**. Open your downloaded `.json` key file, find the line starting with `\"client_email\":`, and copy the address inside the quotation marks (it starts with `stats-reader@` and ends with `.iam.gserviceaccount.com`). This is your **GOOGLE_CLIENT_EMAIL**.",
        "Finally get the **private_key**. In the same `.json` file, find the line starting with `\"private_key\":`. Copy the entire value inside the quotation marks -- it begins with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`. This is your **GOOGLE_PRIVATE_KEY**.",
        "You should now have all **four values** saved: the property ID (digits), the site URL, the client email, and the long private key. Keep them private."
      ]
    },
    {
      "title": "Part G -- Paste the four values into Vercel",
      "steps": [
        "Open a new browser tab, go to `vercel.com`, and click `Log In` (top-right). Sign in to the account that owns your website's project.",
        "On your Vercel dashboard, click the **project for your website** to open it.",
        "Along the top of the project, click the `Settings` tab.",
        "In the left-hand menu of Settings, click `Environment Variables`.",
        "You will now add four variables one at a time. For each one, type the name in the `Key` (or `Name`) box and paste its value in the `Value` box, then click `Save` (or `Add`).",
        "Add the first: in the name box type exactly `GOOGLE_CLIENT_EMAIL`, and in the value box paste the robot email address you saved.",
        "Add the second: in the name box type exactly `GA4_PROPERTY_ID`, and in the value box paste the digits-only property ID.",
        "Add the third: in the name box type exactly `GSC_SITE_URL`, and in the value box paste your site URL (the `https://www.example.com/` form with trailing slash, or the `sc-domain:example.com` form).",
        "Add the fourth: in the name box type exactly `GOOGLE_PRIVATE_KEY`, and in the value box paste the **entire** private key. It is **multi-line** -- paste the whole thing, including the `-----BEGIN PRIVATE KEY-----` line at the start and the `-----END PRIVATE KEY-----` line at the end, exactly as it appears, without removing or adding any line breaks.",
        "If Vercel asks which **environments** each variable applies to, make sure `Production` is ticked (ticking `Preview` and `Development` as well is fine and recommended).",
        "Double-check all four names are spelled **exactly** as shown above, in capital letters, with underscores and no spaces. A single typo in a name will stop it working.",
        "Confirm all four variables now appear in the Environment Variables list."
      ]
    },
    {
      "title": "Part H -- Redeploy and check it worked",
      "steps": [
        "New environment variables only take effect after a fresh deploy, so you must redeploy now.",
        "In your Vercel project, click the `Deployments` tab at the top.",
        "Find the most recent deployment at the top of the list and click the three-dots menu (`...`) on its right-hand side.",
        "Click `Redeploy` in the menu, and in the confirmation pop-up click `Redeploy` again.",
        "Wait for the deployment status to change to `Ready` (this usually takes one to three minutes).",
        "Once it is `Ready`, open your website's **admin dashboard** in your browser and go to its `Analytics` page.",
        "Reload the page. Your Google Analytics visitor numbers should now appear.",
        "Do not worry if the Search Console figures look empty or behind at first -- Search Console data is naturally delayed and typically **lags 2 to 3 days**, so today's searches will show up later this week.",
        "If nothing appears at all, re-check Parts D and E (the robot must be added with `Viewer` in Analytics and `Full` in Search Console) and Part G (no typos in the four names, and the whole private key pasted including its BEGIN and END lines), then redeploy once more."
      ]
    }
  ],
  "envTable": [
    {
      "name": "GOOGLE_CLIENT_EMAIL",
      "desc": "The robot account's email address. Copy the value of the \"client_email\" line from your downloaded JSON key file -- it starts with stats-reader@ and ends with .iam.gserviceaccount.com."
    },
    {
      "name": "GOOGLE_PRIVATE_KEY",
      "desc": "The secret signing key. Copy the entire \"private_key\" value from the JSON file, including the -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- lines. Paste it whole, multi-line, exactly as it appears. Keep it secret."
    },
    {
      "name": "GA4_PROPERTY_ID",
      "desc": "Your Google Analytics property number, digits only (for example 123456789). Found in Analytics under Admin > Property Settings. Do NOT use the G-XXXXXXXXXX measurement ID."
    },
    {
      "name": "GSC_SITE_URL",
      "desc": "Your site as registered in Search Console: either the full URL-prefix form with trailing slash (https://www.example.com/) or the domain form sc-domain:example.com. Match exactly how Search Console lists it."
    }
  ],
  "notes": [
    "Use one single Google account throughout. The account that owns Analytics and Search Console must be the one you sign in with in Google Cloud, or permission steps silently target the wrong place.",
    "GA4_PROPERTY_ID is the all-digits Property ID, never the G-XXXXXXXXXX Measurement ID -- mixing these up is the single most common mistake.",
    "Paste the private key whole and untouched, including the BEGIN and END lines and every line break. Stripping line breaks or quotation marks is what usually breaks the connection.",
    "Environment variable changes do nothing until you redeploy. Always redeploy on Vercel after adding or editing them.",
    "Search Console data lags 2-3 days, so a blank or thin Search Console panel right after setup is normal -- check again in a few days before assuming something is wrong.",
    "Keep the JSON key file private; never email it or put it in a public repository. If it ever leaks, delete that key in the service account's Keys tab and create a new one."
  ]
};
