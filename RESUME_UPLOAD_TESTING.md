# Resume Upload System - Testing Guide

## ✅ System Overview

The resume upload system has been completely redesigned with the following features:

### **Key Improvements**
1. ✅ **Persistent Storage** - Resumes stay in localStorage after logout/login
2. ✅ **Real-time Sync** - Student dashboards and admin dashboards sync automatically (0.5-1 second)
3. ✅ **Proper Data Structure** - `submittedResumes[company][studentEmail]` = resumeData
4. ✅ **Status Tracking** - Admin can update status (Pending → Shortlisted → Rejected)
5. ✅ **Enhanced UI** - Better file upload, status indicators, visual feedback

---

## 🧪 Complete Testing Workflow

### **STEP 1: Login as STUDENT**
```
Email: student@example.com
Password: student123
```

### **STEP 2: Register for a Fair**
1. Go to "Available Career Fairs" section
2. Click "🎯 Register for Fair" button
3. You should see a success message

### **STEP 3: Submit Resume**
1. Scroll to "Submit Your Resume" section
2. Select a PDF file from your computer
3. Click "Submit" button for each company
4. Wait for "✅ Resume submitted!" message
5. See the resume appear with status badge

### **STEP 4: Verify Student Dashboard**
1. See submitted resumes in "My Submitted Resumes" section
2. Shows company name, file, submission date, status
3. Resumes persist even after page refresh

### **STEP 5: Logout Student**
```
Click "Logout" button
```

### **STEP 6: Login as ADMIN**
```
Email: admin@example.com
Password: admin123
```

### **STEP 7: View Student Resumes**
1. Go to "Resume Applications" section
2. You should see grouped by company
3. Shows:
   - Student email
   - File name
   - Submission date
   - Current status badge

### **STEP 8: Update Resume Status**
1. Click resume file name to open modal
2. See full resume preview
3. Click "✅ Shortlist" OR "❌ Reject" buttons
4. Status updates in real-time

### **STEP 9: Verify Status Change (As Student)**
1. Logout from Admin
2. Login back as Student
3. Check "My Submitted Resumes"
4. See status has changed to "Shortlisted" or "Rejected"

---

## 🔍 Data Flow Diagram

```
STUDENT DASHBOARD
  ├─ Register for Fair
  ├─ Submit Resume (PDF)
  │   └─ Saved to localStorage: 
  │       submittedResumes[company][studentEmail] = {
  │         fileName, studentEmail, status, fileData, submittedAt
  │       }
  └─ View "My Submitted Resumes"

         ↓ (Real-time sync via polling every 500ms)

ADMIN DASHBOARD
  └─ View "Resume Applications"
     ├─ Grouped by company
     ├─ See all submissions
     ├─ Update Status
     └─ View PDF preview
```

---

## 📱 Key Features

### **ResumeUpload Component**
- Single file input for all companies
- Company list with status display
- Real-time validation
- Automatic polling (500ms refresh)
- Success messages

### **StudentDashboard**
- "Submit Your Resume" section (for each registered fair)
- "My Submitted Resumes" section (all submitted)
- Shows all details with status
- Auto-refreshes every 500ms

### **AdminDashboard**
- "Resume Applications" section
- Grouped by company
- Status dropdown to change state
- View modal with PDF preview
- Download button
- Real-time updates (1 second refresh)

---

## 🐛 Troubleshooting

### **Resume not appearing?**
1. Check browser console (F12)
2. Verify localStorage: `localStorage.getItem('submittedResumes')`
3. Ensure you're logged in with correct student email
4. Try refreshing page (F5)

### **Admin can't see resumes?**
1. Verify student is logged in as correct email
2. Check that companies were added to fair
3. Admin should refresh page to re-sync
4. Check console for errors

### **Status not updating?**
1. Click status dropdown and select option
2. Wait 1-2 seconds for admin dashboard to refresh
3. Logout student and login again to verify
4. Check localStorage directly

### **File too large?**
1. Use smaller PDF (< 5MB recommended)
2. Base64 encoding adds ~30% size
3. If localStorage quota exceeded, error will show

---

## 📊 localStorage Structure

```javascript
// Key: 'submittedResumes'
// Value:
{
  "Google": {
    "student@example.com": {
      "fileName": "resume.pdf",
      "company": "Google",
      "studentEmail": "student@example.com",
      "studentName": "Student User",
      "fairName": "Tech Career Fair",
      "submittedAt": "2026-04-08T15:30:00.000Z",
      "status": "Pending",
      "fileData": "data:application/pdf;base64,..."
    }
  },
  "Microsoft": {
    "student@example.com": {
      // similar structure
    }
  }
}
```

---

## ✨ Testing Checklist

- [ ] Student can login
- [ ] Student can register for fair
- [ ] Student can see "Submit Your Resume" section
- [ ] Student can upload PDF resume
- [ ] Resume shows with "Pending" status
- [ ] Status appears in "My Submitted Resumes"
- [ ] Student can logout
- [ ] Student can login again
- [ ] Resume still visible (persistent)
- [ ] Admin can login
- [ ] Admin can see all student resumes
- [ ] Admin can change status to "Shortlisted"
- [ ] Status change persists
- [ ] Student sees updated status
- [ ] Admin can view PDF preview
- [ ] Admin can download resume

---

## 🚀 Performance Notes

- **Polling Interval**: 500ms (Student), 1000ms (Admin)
- **File Size Limit**: Browser localStorage (typically 5-10MB per domain)
- **Sync Time**: Updates visible within 1-2 seconds
- **No Server Required**: All data in localStorage

---

## 📝 Notes

- Test with multiple browsers to simulate different students
- Use incognito mode for separate logins
- Check browser console (F12 → Console) for debugging
- localStorage data persists until browser cache is cleared
