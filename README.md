# Mrugaya Jewelry Store

A beautiful traditional Maharashtrian jewelry e-commerce store built with React, Express, and TypeScript.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

## Deploying to Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` configuration
5. Add the required environment variables in Render dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `RAZORPAY_KEY_ID` - Your Razorpay API key
   - `RAZORPAY_KEY_SECRET` - Your Razorpay secret

### Option 2: Manual Configuration

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `NODE_ENV=production node dist/index.js`
   - **Environment**: Node
4. Add environment variables as listed above

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` for deployment |
| `DATABASE_URL` | PostgreSQL connection string |
| `RAZORPAY_KEY_ID` | Razorpay API key for payments |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key for payments |

## Build Commands

```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production node dist/index.js
```
# mrugaya2
