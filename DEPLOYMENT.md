# Deployment Guide

## **Backend Deployment to Render**

### Step 1: Push Backend to GitHub
1. Create a GitHub repository (if not already done)
2. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in the configuration:
   - **Name**: `farming-rental-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Plan**: Free (or paid if needed)

### Step 3: Add Environment Variables in Render
1. Go to your service dashboard
2. Click **"Environment"** tab
3. Add these variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-vercel-url.vercel.app
   ```

4. Deploy the service

---

## **Frontend Deployment to Vercel**

### Step 1: Ensure MongoDB is Connected
Your backend should now be running. Get the deployment URL (e.g., `https://your-service.onrender.com`)

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New Project"** → Import your GitHub repository
3. Select your repository and click **"Import"**
4. Configure the project:
   - **Framework Preset**: React
   - **Root Directory**: `./` (or leave blank)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Add Environment Variables in Vercel
1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   REACT_APP_API_URL=https://your-service.onrender.com
   ```
3. Click **"Deploy"**

---

## **After Deployment**

### Update MongoDB Connection in Render
1. Make sure your `MONGODB_URI` in Render env vars has your actual MongoDB connection string
2. Replace the password in the connection string (currently visible in server.js)

### Test the Connection
- Frontend should be at: `https://your-project.vercel.app`
- Backend API should be at: `https://your-service.onrender.com`
- Try accessing: `https://your-service.onrender.com/api/equipment`

### Common Issues & Solutions
- **CORS Errors**: Update `CORS_ORIGIN` in Render to match your Vercel URL
- **FILE UPLOADS**: Currently stored locally; for production, use cloud storage (AWS S3, Cloudinary)
- **Cold Start**: First request to Render may be slow (free tier)

---

## **Additional Security**

Edit [backend/.env.example](backend/.env.example) and never commit real credentials to GitHub!
