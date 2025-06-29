# Deployment Guide for Render.com

## Prerequisites

1. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas is recommended for free tier)
2. **GitHub Repository**: Push your code to a GitHub repository
3. **Render.com Account**: Sign up for a free account at render.com

## Deployment Steps

### 1. Set up MongoDB (if not already done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use 0.0.0.0/0 for all IPs)
5. Get your connection string

### 2. Deploy to Render

1. **Connect GitHub Repository**:
   - Log in to your Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select this repository

2. **Configure Service**:
   - **Name**: `link-api` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Set Environment Variables**:
   In the Render dashboard, add these environment variables:
   
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name (optional)
   CLOUDINARY_API_KEY=your_cloudinary_key (optional)
   CLOUDINARY_API_SECRET=your_cloudinary_secret (optional)
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   **Important**: Replace the placeholder values with your actual credentials.

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - The deployment URL will be provided once complete

### 3. Verify Deployment

- Visit your deployment URL + `/health` to check if the API is running
- Example: `https://your-app-name.onrender.com/health`

### 4. API Endpoints

Your API will be available at:
- Base URL: `https://your-app-name.onrender.com`
- Health Check: `https://your-app-name.onrender.com/health`
- API Routes: `https://your-app-name.onrender.com/api/...`

## Important Notes for Free Tier

1. **Sleep Mode**: Free services sleep after 15 minutes of inactivity
2. **Cold Starts**: First request after sleep may take 30+ seconds
3. **Build Time**: Limited to 10 minutes
4. **Bandwidth**: 100GB/month limit
5. **Hours**: 750 hours/month limit

## Troubleshooting

1. **Build Fails**: Check build logs in Render dashboard
2. **App Won't Start**: Verify environment variables are set correctly
3. **Database Connection**: Ensure MongoDB URI is correct and accessible
4. **Port Issues**: Render automatically assigns PORT environment variable

## Local Testing

Before deploying, test your build locally:

```bash
npm run build
NODE_ENV=production npm start
```

## Monitoring

- Use Render's built-in logs to monitor your application
- Set up health checks and monitoring as needed
- Consider upgrading to paid plans for production use
