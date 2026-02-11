# Specification

## Summary
**Goal:** Unblock the LifeOS profile onboarding dialog after Internet Identity login so users can reliably continue into the app or exit back to sign-in.

**Planned changes:**
- Fix the frontend profile setup dialog “Continue” action to validate the name, save the profile, close the dialog on success, and surface an English error message on failure without becoming unresponsive.
- Ensure the dialog does not leave an invisible overlay that blocks interaction with the underlying app UI after it closes.
- Add a reliable “Exit” button on the dialog that logs the user out and returns to the sign-in screen, even if profile APIs are failing.
- Add/verify backend per-user profile persistence APIs: query to fetch the caller profile (none when unset) and update to save the caller profile (at minimum: name), scoped per principal.

**User-visible outcome:** After logging in, users can enter their name and press “Continue” to complete onboarding and use the app; if saving fails they see an English error and can retry; users can also press “Exit” to log out and return to sign-in.
