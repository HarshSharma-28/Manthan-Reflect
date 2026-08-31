# Manthan — Private AI Reflection Journal (UN SDG 3.4)

Manthan is a private, server-authoritative AI reflection journal aligned with **UN Sustainable Development Goal 3** (Good Health and Well-being, Target 3.4). It provides a thoughtful, non-clinical conversational mirror for users to articulate thoughts and process emotions, backed by server-side wellbeing guardrails, zero client Firestore writes, and strict data sovereignty.

---

## 1. Threat Model & Security Architecture

| Threat Zone | Threat Scenario | Countermeasure & Security Invariant |
| :--- | :--- | :--- |
| **Input Surfaces** | Direct Prompt Injection / Jailbreaking | Strict non-clinical system instructions, dual-phase distress evaluation, output structure validation. |
| **Input Surfaces** | Malformed / Oversized Payloads | Top-level body parsing, null-safe destructuring, strict input length limits. |
| **Planning & Reasoning** | Clinical Authority Impersonation & Acute Distress | **Care Layer Directive**: Automated server-side distress check drops advice and presents static, verified crisis hotlines. |
| **Planning & Reasoning** | Retrieved-Context Injection | Delimited `<reflection_session>` wrapping; sanitized prompts treating stored entries strictly as data. |
| **Tool & Backend Execution** | Broken Authentication / Token Forgery | **Server-Authoritative UID derivation**: UID extracted strictly from verified Firebase ID token (`req.user.uid`). |
| **Tool & Backend Execution** | API Key Exfiltration | Server-side only `@google/genai` calls via Express `/api` proxy. Secret Manager / server environment variables. |
| **Memory & State (Firestore)** | Direct Client DB Writes & Privilege Escalation | **Zero Client Writes**: `firestore.rules` enforces owner-bound read and `allow write: if false;`. |
| **Memory & State (Data Rights)** | Data Sovereignty & GDPR Compliance | JSON export (`GET /api/user/export`) and hard-delete (`POST /api/user/delete-all`) with explicit typed confirmation. |
| **Inter-System Communication** | Gemini Outages / Rate Limits (503/429/500) | **Resilient Fallback Ladder** (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-flash-latest` → `gemini-2.5-pro`). |

---

## 2. Environment & Prerequisites

1. **Google Cloud APIs**:
   Enable Cloud Run, Cloud Firestore, and Secret Manager APIs:
   ```bash
   gcloud services enable run.googleapis.com firestore.googleapis.com secretmanager.googleapis.com
   ```

2. **Firebase CLI**:
   Ensure Firebase CLI is installed and logged in:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

---

## 3. Secret Management Setup

Create and bind the `GEMINI_API_KEY` secret using Google Cloud Secret Manager:

```bash
# 1. Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 2. Grant Cloud Run runtime service account permission to read the secret
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 4. Firestore Database Security Configuration

Deploy the server-authoritative Firestore security rules:

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;

      match /entries/{entryId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if false;
      }
    }
  }
}
```

Deploy rules using Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 5. Build & Cloud Run Deployment Flow

Build and deploy the unified full-stack Node/Express container to Cloud Run:

```bash
# Deploy to Google Cloud Run
gcloud run deploy manthan-journal \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --update-labels=dev-tutorial=cloud-run-ai-challenge
```

### Verification Label Binding
```bash
gcloud run services update manthan-journal \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 6. Functional Stability & Testing Walkthrough

The following step-by-step verification checklist tests all user-facing interactions and system guarantees:

### Test Case 1: Landing Page & Non-Clinical Guardrails
1. Open the application in an unauthenticated browser state.
2. Verify the landing screen clearly explains what Manthan is (Reflective mirror) and what it is not (Not a therapist, not a diagnostic tool).
3. Verify only "Sign in with Google" is present (no email/password forms).

### Test Case 2: Authentication & Empty State Dashboard
1. Click "Sign in with Google" and complete Google authentication.
2. Verify redirection to the private dashboard showing "Welcome back" with the user's Google display name.
3. Verify the empty state renders: "No reflections written yet" with a "Begin First Reflection" action.

### Test Case 3: Conversational Reflection Dialogue
1. Click "New Reflection".
2. Verify the initial opening prompt displays: *"Welcome to Manthan. Take a deep breath. What is gently resting on your mind today?"*
3. Type a reflection (e.g., *"I've been feeling overwhelmed by competing priorities at work today."*) and send.
4. Verify the server-side Gemini fallback ladder responds warmly, asking a gentle open-ended question without clinical diagnosis.

### Test Case 4: Care Layer Wellbeing Distress Trigger
1. In an active reflection, send a message indicating severe distress or crisis.
2. Verify the Care Layer intercepts the message:
   - Drops advice or deep questioning.
   - Responds with brief, warm, non-clinical supportive words.
   - Surfaces the static `CareBanner` with verified regional helplines (988 Lifeline, Crisis Text Line, Samaritans, Tele-MANAS).
   - Marks `careFlag: true` only on that session.

### Test Case 5: Reflection Synthesis & Persistence
1. Click "Finish & Save Reflection".
2. Verify loading indicator *"Synthesizing & Saving..."* is displayed.
3. Verify generation of a 3-6 word title, concise summary, and 3-5 theme tags.
4. Verify entry is saved to Firestore via Firebase Admin SDK and immediately opens in read-only mode.
5. Click "Back to Reflections" and confirm the entry appears at the top of the dashboard.

### Test Case 6: Zero Silent Failure & Input Preservation
1. Disconnect network or trigger a request timeout.
2. Attempt to send a message or finish reflection.
3. Verify an error banner is displayed with a "Retry Message" / "Retry Save" button, and the user's typed input is NEVER lost.

### Test Case 7: Data Sovereignty (Export & Hard Deletion)
1. Click the Privacy icon (Shield) in the navigation bar.
2. Click "Export JSON" and verify that a `.json` file containing all past reflections is downloaded.
3. Type `DELETE_MY_ENTRIES_PERMANENTLY` in the erasure section and click "Permanently Erase All My Data".
4. Verify that all Firestore entries and user profile are removed, and the session is logged out.
