# MongoDB Atlas Setup Guide

## Common Connection Issues and Solutions

### 1. IP Whitelist Issue (Most Common)

MongoDB Atlas requires your IP address to be whitelisted. 

**To fix:**
1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com
2. Click on **Network Access** (or **IP Access List**) in the left sidebar
3. Click **Add IP Address**
4. Either:
   - Click **Add Current IP Address** (for development)
   - Or add `0.0.0.0/0` to allow all IPs (⚠️ **NOT recommended for production**)
5. Wait a few minutes for changes to propagate

### 2. SSL/TLS Configuration

The connection code now includes proper TLS settings. If you still get SSL errors:

1. **Check your connection string format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name
   ```

2. **Ensure your connection string includes:**
   - Correct username and password
   - Database name at the end
   - No extra parameters that might conflict

### 3. Database User Permissions

Ensure your MongoDB user has proper permissions:

1. Go to **Database Access** in MongoDB Atlas
2. Find your user
3. Ensure they have **Read and write to any database** or specific database permissions

### 4. Connection String Format

Your `.env` file should have:
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/docusaurus_db
```

**Important:**
- Replace `username` and `password` with your actual credentials
- Replace `cluster.mongodb.net` with your actual cluster URL
- The database name (`docusaurus_db`) will be created automatically if it doesn't exist

### 5. Testing the Connection

Run the initialization script to test:
```bash
pnpm run db:init
```

If successful, you'll see:
```
✅ Connected to MongoDB successfully
✅ MongoDB database ping successful
✅ Default tenant created successfully!
```

### 6. Troubleshooting Steps

1. **Check your connection string:**
   - Verify username and password are correct
   - Ensure no special characters need URL encoding
   - Check the cluster URL is correct

2. **Verify IP whitelist:**
   - Your current IP must be in the whitelist
   - Wait 2-3 minutes after adding IP

3. **Check MongoDB Atlas status:**
   - Ensure your cluster is running (not paused)
   - Check for any service alerts

4. **Test connection manually:**
   ```bash
   # Using MongoDB Compass or mongo shell
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/docusaurus_db"
   ```

### 7. Alternative: Use MongoDB Compass

Download MongoDB Compass and test your connection string there first:
- Download: https://www.mongodb.com/try/download/compass
- Paste your connection string
- If it works in Compass, the issue is in the code
- If it doesn't work in Compass, the issue is with Atlas configuration

### 8. Common Error Messages

**"ReplicaSetNoPrimary"**
- Usually means IP not whitelisted
- Or cluster is paused/stopped

**"SSL/TLS alert internal error"**
- Network/firewall issue
- IP whitelist problem
- Connection string format issue

**"Authentication failed"**
- Wrong username/password
- User doesn't have proper permissions

### 9. Quick Fix Checklist

- [ ] IP address whitelisted in MongoDB Atlas
- [ ] Connection string format is correct
- [ ] Username and password are correct
- [ ] Database user has proper permissions
- [ ] Cluster is running (not paused)
- [ ] `.env` file has correct `DATABASE_URL`
- [ ] Waited 2-3 minutes after IP whitelist changes

---

**Need more help?** Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com/

