# Login System - Test Credentials

The authentication system is now fully functional! Here are the test credentials you can use:

## Test Users (Pre-loaded)

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** Admin
- **Redirects to:** /admin/dashboard

### Student Account
- **Email:** student@example.com
- **Password:** student123
- **Role:** Student
- **Redirects to:** /student/dashboard

## How to Test

### Method 1: Using Test Accounts
1. Go to the Login page
2. Select either "Admin" or "Student" button
3. Enter the email and password from above
4. Click Login
5. You'll be redirected to the appropriate dashboard

### Method 2: Register New Account
1. Go to the Register page
2. Select "Admin" or "Student" role
3. Enter your information
4. Register the account
5. Go back to Login page with your new credentials

## Features Implemented

✅ Role-based registration (Admin or Student)
✅ Role-based login with validation
✅ Email and password authentication
✅ Users stored in localStorage (for demo purposes)
✅ Auto-redirect to appropriate dashboard based on role
✅ Ability to register new users with their chosen role
✅ Login validates that the correct role is being used

## How It Works

1. When you register, your account is saved with your chosen role in localStorage
2. When you login:
   - The system checks your email and password
   - It verifies you're trying to login with the correct role
   - If everything matches, you're logged in and redirected
3. Once logged in, your user data is stored in localStorage
4. You can navigate based on your role (Admin can see admin dashboard, Student can see student dashboard)

## Notes

- In production, passwords should be hashed on the server
- User data should be persisted in a real database instead of localStorage
- The current system uses localStorage for demonstration purposes
