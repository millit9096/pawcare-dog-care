# PawCare store builds

PawCare's web/PWA release is separate from the Capacitor Android and iOS app. The native app adds locally saved pet-care reminders and on-device notification scheduling. Reminder data stays on the phone; there is no account or server sync.

## Before the first store build

The app identifier in `capacitor.config.json` is `com.millit9096.pawcare`. Register this exact identifier in both developer consoles and create the PawCare app records before running the release workflow. App identifiers cannot be changed after a store listing is created. Confirm the identifier is available before creating those records.

In GitHub, open **millit9096/pawcare-dog-care → Settings → Secrets and variables → Actions**. Add secrets there; never paste keys into chat or commit them to the repository.

### Android secrets

- `ANDROID_KEYSTORE_BASE64`: base64-encoded release upload keystore.
- `ANDROID_KEYSTORE_PASSWORD`: keystore password.
- `ANDROID_KEY_ALIAS`: upload-key alias.
- `ANDROID_KEY_PASSWORD`: upload-key password.
- `PLAY_SERVICE_ACCOUNT_JSON`: service-account JSON with access to this app in Play Console.

Enable Play App Signing for the app. The workflow uploads to the **internal** testing track, not production. Google Play may require a closed test before production access for some personal accounts.

### Apple secrets and variables

Add these Actions secrets:

- `APPLE_DISTRIBUTION_P12_BASE64`: base64-encoded Apple Distribution `.p12` certificate.
- `APPLE_DISTRIBUTION_P12_PASSWORD`: password used to export that certificate.
- `APPSTORE_API_PRIVATE_KEY`: contents of the App Store Connect API `.p8` key.

Add these Actions variables:

- `APPSTORE_ISSUER_ID`: App Store Connect API issuer ID.
- `APPSTORE_API_KEY_ID`: API key ID.
- `APPLE_TEAM_ID`: Apple Developer team ID.
- `IOS_PROFILE_NAME`: name of the App Store provisioning profile for `com.millit9096.pawcare`.

The API key needs App Manager access. Register the bundle identifier and create an App Store provisioning profile for it. The workflow uses a hosted macOS runner, signs the iOS app, and uploads it to TestFlight. Apple App Review submission and release remain in App Store Connect.

## Run the workflow

Open **Actions → PawCare mobile release → Run workflow**, select Android, iOS, or both, and start it. Android uploads to internal testing; iOS uploads to TestFlight. Store listing text, screenshots, privacy disclosures, and the final production review must be completed in the respective console. Uploading a build does not publish it to everyone.

## Local web preview

From this folder, run `npm install`, then `npm run build`. This creates the Vite web bundle in `www`; generated platform projects are intentionally not committed.

