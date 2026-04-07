# NOTE: The Frontend is present in Zorvyn-Finance directory

# Zorvyn Finance Dashboard

A modern, full-featured finance tracking dashboard built with React, Tailwind CSS, Supabase, and shadcn/ui components.


Vercel: https://zorvyn-finance-delta.vercel.app/

## 🧪 Testing

### Test Credentials

The application comes with pre-configured test accounts for easy testing:

#### Viewer Account (Read-only)
- **Email**: `tester@tester.com`
- **Password**: `tester`
- **Role**: Viewer (can view transactions, cannot modify)

#### Admin Account (Full access)
- **Email**: `admin@admin.com`
- **Password**: `admin@zorvyn`
- **Role**: Admin (can add, edit, delete transactions)

### Testing Different Features

1. **Login as Viewer** (`tester@tester.com`) to test:
   - Dashboard view with read-only transactions
   - Search, filter, and sort functionality
   - Charts and analytics
   - CSV export
   - No add/edit/delete buttons visible

2. **Login as Admin** (`admin@admin.com`) to test:
   - All viewer features
   - Add new transactions
   - Edit existing transactions
   - Delete transactions
   - Full CRUD functionality


## 🎯 Features

### Authentication & Authorization
- ✅ **Supabase Authentication** - Secure login and signup
- ✅ **Role-Based Access Control (RBAC)**
  - **Viewer**: Read-only access to transactions
  - **Admin**: Full CRUD access (create, read, update, delete transactions)
- ✅ **Session Persistence** - Stay logged in after page refresh
- ✅ **Protected Routes** - Automatic redirect for unauthenticated users

### Dashboard Features
- 📊 **Summary Cards** - Balance, Income, and Expenses at a glance
- 📈 **Balance Trend Chart** - Line chart showing balance over time
- 🥧 **Spending by Category** - Pie chart visualization
- 📝 **Transaction Management**
  - Search transactions
  - Filter by type (income/expense) and category
  - Sort by date or amount
  - CSV export functionality
- 💡 **Insights Panel**
  - Highest spending category
  - Monthly comparison
  - Automatic analytics

### UI/UX
- 🎨 **Modern Landing Page** with Spotlight Navbar
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🔔 **Toast Notifications** - User feedback for all actions
- ✨ **Logo Slider** - Showcase technologies used
- 🎯 **Empty States** - Helpful messages when no data exists
- ⚡ **Loading States** - Clear feedback during async operations

## 🚀 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Supabase** - Backend as a Service (Auth + Database)
- **React Router v7** - Client-side routing
- **Recharts** - Chart visualization library
- **Lucide React** - Icon library
- **shadcn/ui** components - SpotlightNavbar, LogoSlider

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Zorvyn-Finance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup Supabase Database**
   
   Follow the instructions in `SUPABASE_SCHEMA.md` to:
   - Create the `profiles` and `transactions` tables
   - Set up Row Level Security (RLS) policies
   - Create the trigger for auto-creating profiles
   - Create at least one admin user

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📂 Project Structure

```
Zorvyn-Finance/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components (if any)
│   │   ├── charts/         # Chart components (Line, Pie)
│   │   ├── transactions/   # Transaction-related components
│   │   ├── SpotlightNavbar.jsx
│   │   ├── LogoSlider.jsx
│   │   ├── Navbar.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── InsightsPanel.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── TransactionsContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useTheme.js
│   ├── lib/                # Utilities and services
│   │   ├── supabase/
│   │   │   ├── client.js   # Supabase client
│   │   │   └── db.js       # Database queries
│   │   ├── utils.js        # Helper functions
│   │   └── storage.js      # localStorage utilities
│   ├── App.jsx
│   ├── AppRouter.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env                    # Environment variables (not committed)
├── components.json         # shadcn/ui config
├── jsconfig.json          # Path aliases
├── vite.config.js
├── package.json
├── SUPABASE_SCHEMA.md     # Database schema documentation
└── README.md
```

### Quick Test Flow

```bash
# 1. Start the development server
npm run dev

# 2. Visit http://localhost:5173
# 3. Login with either test account
# 4. Explore the dashboard features
# 5. Try switching between accounts to see role differences
```

## 🔑 User Roles

### Viewer (Default for Signups)
- Can view all dashboard sections
- Can search, filter, and sort transactions
- Can export transactions to CSV
- **Cannot** add, edit, or delete transactions

### Admin (Must be created manually)
- All viewer permissions
- Can add new transactions
- Can edit existing transactions
- Can delete transactions

### Creating an Admin User

1. Create a user through the signup page or Supabase dashboard
2. In Supabase SQL Editor, run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'user_id_here';
   ```

## 🎨 Customization

### Theme
- Theme toggle is available in the navbar
- Stored in localStorage
- CSS variables defined in `src/index.css`

### Colors
- Primary: Emerald (green)
- Adjust in `src/index.css` for the `--ring` CSS variable

### Logo
- Replace the "Z" logo in `SpotlightNavbar.jsx` and `Navbar.jsx` with your own image

## 🐛 Troubleshooting

### "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"
- Ensure your `.env` file exists and has the correct keys
- Restart the dev server after adding environment variables

### Transactions not appearing
- Check that your Supabase tables are created correctly
- Verify RLS policies are set up properly
- Ensure the user is authenticated

### Cannot add/edit/delete transactions
- Make sure the logged-in user has the `admin` role in the `profiles` table
- Check browser console for any error messages

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

---

Built with ❤️ using React, Tailwind CSS, and Supabase

