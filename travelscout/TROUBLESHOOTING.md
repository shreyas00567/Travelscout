# 🔧 TravelScout - Troubleshooting Guide

## Common Issues and Solutions

---

## 🗄️ Database Issues

### Issue: "Database connection failed"

**Symptoms:**
```
❌ Database connection failed: Access denied for user 'root'@'localhost'
```

**Solutions:**

1. **Check MySQL is running:**
```powershell
# Check if MySQL service is running
Get-Service -Name "*mysql*"

# Start MySQL service if stopped
Start-Service MySQL80
```

2. **Verify credentials in .env:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password  # ⚠️ Update this!
DB_NAME=travelscout_db
DB_PORT=3306
```

3. **Test MySQL connection:**
```powershell
mysql -u root -p
# Enter your password
```

4. **Check if database exists:**
```sql
SHOW DATABASES;
USE travelscout_db;
SHOW TABLES;
```

---

### Issue: "Table 'travelscout_db.featured_destinations' doesn't exist"

**Solution:**

Run the schema file again:
```sql
source C:\Users\krush\OneDrive\Desktop\dbms\travelscout\backend\database\schema.sql
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS travelscout_db;
USE travelscout_db;
-- Copy and paste the CREATE TABLE statements from schema.sql
```

---

### Issue: "No data returned from API"

**Check:**

1. **Verify data exists:**
```sql
SELECT * FROM featured_destinations;
```

2. **Check is_active flag:**
```sql
SELECT * FROM featured_destinations WHERE is_active = 1;
```

3. **If no data, re-run INSERT statements from schema.sql**

---

## 🌐 Backend Issues

### Issue: "Port 5000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find and kill the process:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace 12345 with actual PID)
taskkill /PID 12345 /F
```

2. **Or change the port in .env:**
```env
PORT=5001
```

---

### Issue: "Cannot find module 'express'"

**Solution:**
```powershell
cd backend
Remove-Item -Recurse -Force node_modules
npm install
```

---

### Issue: "CORS error in browser console"

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/featured' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**

Verify CORS is enabled in server.js:
```javascript
import cors from 'cors';
app.use(cors());
```

If still not working:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

### Issue: "Backend crashes on start"

**Check:**

1. **Environment variables:**
```powershell
# Make sure .env file exists
Test-Path .\backend\.env
```

2. **Syntax errors:**
```powershell
# Check for syntax errors
node --check backend/server.js
```

3. **Dependencies:**
```powershell
cd backend
npm install
```

---

## ⚛️ Frontend Issues

### Issue: "Port 3000 already in use"

**Solutions:**

1. **Kill the process:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **Or use a different port:**
Edit `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
})
```

---

### Issue: "Cannot find module 'react'"

**Solution:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

---

### Issue: "Tailwind CSS not working / No styles"

**Symptoms:**
- Page loads but looks unstyled
- No colors or spacing

**Solutions:**

1. **Check index.css imports:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. **Verify main.jsx imports index.css:**
```javascript
import './index.css'
```

3. **Check tailwind.config.js content paths:**
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

4. **Restart Vite dev server:**
```powershell
# Stop (Ctrl + C)
npm run dev
```

---

### Issue: "Images not loading"

**Symptoms:**
- Broken image icons
- Console errors: "Failed to load resource"

**Check:**

1. **Internet connection** (images are from Unsplash CDN)
2. **URL is correct** in database:
```sql
SELECT name, image_url FROM featured_destinations;
```

3. **CORS issues** with image CDN (usually not a problem with Unsplash)

**Temporary fix:**
Use placeholder images:
```javascript
image_url={destination.image_url || 'https://via.placeholder.com/800x450'}
```

---

### Issue: "Framer Motion animations not working"

**Check:**

1. **Framer Motion is installed:**
```powershell
npm list framer-motion
```

2. **Import is correct:**
```javascript
import { motion } from 'framer-motion';
```

3. **Variants are defined:**
```javascript
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};
```

---

### Issue: "API call returns 404"

**Symptoms:**
```
GET http://localhost:5000/api/featured 404 (Not Found)
```

**Check:**

1. **Backend is running:**
```powershell
# Check if server started
# Should see: "TravelScout API Server Running"
```

2. **Correct URL in Axios:**
```javascript
axios.get('http://localhost:5000/api/featured')  // ✅ Correct
axios.get('http://localhost:5000/featured')      // ❌ Wrong
```

3. **Port number matches:**
- Backend: Check console output or .env
- Frontend: Check axios URL

---

## 📱 Responsive Design Issues

### Issue: "Mobile menu not working"

**Check:**

1. **State management:**
```javascript
const [isMenuOpen, setIsMenuOpen] = useState(false);
```

2. **Click handler:**
```javascript
onClick={() => setIsMenuOpen(!isMenuOpen)}
```

3. **Conditional rendering:**
```javascript
{isMenuOpen && (
  <motion.div>...</motion.div>
)}
```

---

### Issue: "Layout breaks on mobile"

**Check:**

1. **Viewport meta tag** in index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

2. **Responsive classes:**
```javascript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

3. **Overflow issues:**
```css
/* Add to problematic elements */
overflow-x: hidden;
```

---

## 🚀 Performance Issues

### Issue: "Slow page load"

**Solutions:**

1. **Optimize images:**
- Use WebP format
- Compress images
- Use appropriate sizes

2. **Enable lazy loading:**
```javascript
<img src="..." loading="lazy" alt="..." />
```

3. **Check network tab** in DevTools:
- Identify slow resources
- Check for failed requests

---

### Issue: "Animations are choppy"

**Solutions:**

1. **Use GPU-accelerated properties:**
```css
/* Good */
transform: translateY(-10px);
opacity: 0.8;

/* Avoid */
top: -10px;
margin-top: -10px;
```

2. **Reduce animation complexity:**
```javascript
// Simpler animation
whileHover={{ y: -10 }}

// Instead of
whileHover={{ y: -10, scale: 1.1, rotate: 2 }}
```

3. **Check browser performance:**
- Open DevTools > Performance tab
- Record while animating
- Look for dropped frames

---

## 🛠️ Development Issues

### Issue: "Changes not reflecting"

**Solutions:**

1. **Hard refresh browser:**
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

2. **Clear cache:**
```powershell
# Stop dev server
# Delete .cache folders
Remove-Item -Recurse -Force frontend/node_modules/.vite
# Restart dev server
```

3. **Check file saved:**
- Look for indicator in VS Code
- Check file timestamp

---

### Issue: "ESLint/TypeScript errors"

**Solution:**

This project uses JavaScript, not TypeScript. If you see errors:

1. **Check file extension:**
- Should be `.jsx` not `.tsx`
- Should be `.js` not `.ts`

2. **Ignore CSS errors:**
The `@tailwind` directives may show errors but work correctly.

---

## 🔍 Debugging Tips

### Backend Debugging

1. **Add console logs:**
```javascript
app.get('/api/featured', async (req, res) => {
  console.log('Featured endpoint hit');
  try {
    const [rows] = await db.query('...');
    console.log('Rows:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
  }
});
```

2. **Test with curl:**
```powershell
curl http://localhost:5000/api/featured
```

3. **Use Postman or Insomnia** for API testing

---

### Frontend Debugging

1. **Add console logs:**
```javascript
useEffect(() => {
  const fetchData = async () => {
    console.log('Fetching destinations...');
    const response = await axios.get('...');
    console.log('Response:', response.data);
  };
}, []);
```

2. **Check React DevTools:**
- Install React Developer Tools extension
- Inspect component state
- Check props

3. **Network tab:**
- Open DevTools > Network
- Filter by XHR
- Check request/response

---

## 📊 Health Check Commands

### Verify Everything is Working

**Database:**
```sql
USE travelscout_db;
SELECT COUNT(*) FROM featured_destinations;
-- Should return 6
```

**Backend:**
```powershell
curl http://localhost:5000/
# Should return welcome message

curl http://localhost:5000/api/featured
# Should return JSON array of destinations
```

**Frontend:**
```
Open http://localhost:3000
Check browser console (F12):
- No red errors
- API calls successful (200 status)
- Data loads and displays
```

---

## 🆘 Still Having Issues?

### Steps to Get Help

1. **Gather information:**
   - Error message (full text)
   - Steps to reproduce
   - What you've tried
   - Screenshots if applicable

2. **Check console logs:**
   - Backend: Terminal output
   - Frontend: Browser console (F12)

3. **Verify versions:**
```powershell
node --version    # Should be v16+
npm --version     # Should be v8+
mysql --version   # Should be v8+
```

4. **Check files exist:**
```powershell
# All key files should exist
Test-Path .\backend\server.js
Test-Path .\backend\.env
Test-Path .\frontend\src\components\HomePage.jsx
```

5. **Try fresh install:**
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 🎯 Quick Reference

### Start Everything Fresh

```powershell
# Terminal 1 - Backend
cd backend
npm install
# Edit .env file
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Database
mysql -u root -p
source backend/database/schema.sql
```

### Kill All Processes

```powershell
# Find and kill ports
netstat -ano | findstr ":3000 :5000"
# Kill each PID:
taskkill /PID <PID> /F
```

---

**Most issues can be resolved with a fresh install and proper .env configuration! 🎉**
