# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Firebase backend (Auth + Firestore + QR tickets + Admin scan)

This repo now includes a Firebase backend in the same `Jagowelfare/` folder:

- **Hosting**: Firebase Hosting serves the React build (SPA rewrite).
- **Functions**: `functions/` exports one HTTP API function named `api`.
- **Firestore**: `firestore.rules` locks down writes so tickets/check-ins are **server-only**.

### 1) Configure Firebase project

- Edit `.firebaserc` and replace `CHANGE_ME` with your Firebase **project id**.
- Create a Firebase Web App in the Firebase Console and copy values into your local `.env`:
  - Start from `.env.example` (copy it to `.env` and fill values).

### 2) Install dependencies

From `Jagowelfare/`:

```bash
npm install
```

From `Jagowelfare/functions/`:

```bash
npm install
```

### 3) Set backend secrets (QR signing)

The backend signs QR payloads using `JYF_QR_HMAC_SECRET`.

For local development you can set it in your shell environment before running Functions.
For production, set it in your Firebase environment (recommended approach is to use Firebase secrets).

### 4) API endpoints

The Cloud Function is exposed as:

- `GET /events`
- `GET /events/:eventId`
- `POST /events/:eventId/register` (auth required) → returns `{ qrPayload }`
- `GET /my/tickets` (auth required)
- `POST /admin/scan` (staff/admin required) → validates QR + marks check-in atomically
- `POST /admin/setUserRole` (admin required; or bootstrap header) → set `admin` / `staff` custom claims

### 5) Bootstrap the first admin

There is a one-time bootstrap mechanism for the very first admin:

- Set `JYF_BOOTSTRAP_SECRET` in the Functions environment
- Call `POST /admin/setUserRole` with header `x-bootstrap-secret: <your-secret>` and body:
  - `{ "uid": "<firebase-auth-uid>", "admin": true }`

After the first admin exists, remove/rotate the bootstrap secret and use admin-only role assignment.

### 6) Admin panel

- Admin scanner page: `/admin/scan` (requires `staff` or `admin` claim)
- Users can view tickets: `/my-tickets`

### 7) Running backend tests

From `Jagowelfare/functions/`:

```bash
npm test
```

### Notes on emulators

Firestore emulator requires Java. If you want to run the full Firebase Emulator Suite locally, install Java and then run:

```bash
npm run emulators
```

## Deployment (Firebase Hosting + Functions + Firestore rules)

From `Jagowelfare/`:

```bash
# Build the React app
npm run build

# Deploy Firestore rules/indexes
npm run deploy:firestore

# Deploy Functions (backend)
npm run deploy:functions

# Deploy Hosting (frontend)
npm run deploy:hosting
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
