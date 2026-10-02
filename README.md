# 🍲 Weekly Dinner Planner (`madplan`)

A modern, mobile-first web application designed for families to effortlessly plan weekly dinners, track grocery spending, and visualize spending history over time.

Built as a 100% static, client-side web application hosted on **GitHub Pages**, with zero server tracking and full offline support via `localStorage`.

---

## ✨ Features

- **🗓️ Weekly Dinner Planner (Mon–Sun):**
  - Intuitive daily cards with ISO week numbering and date intervals.
  - Interactive meal editor with one-tap popular dinner ideas (*Tacos, Spaghetti Bolognese, Homemade Pizza, Stir Fry, Steak & Potatoes*, etc.).
  - Ingredient checklist per meal with interactive purchased check-off.
  - Live weekly cost calculation and weekly budget progress bar.
  - Duplicate current week schedule directly to the next week.
- **📊 Spending History & Analytics:**
  - Responsive **Recharts** bar/pill charts tracking total grocery spending across chronological weeks.
  - Visual budget benchmark line and color indicators for within-budget vs. over-budget weeks.
  - Key Performance Indicators: **Average Weekly Spend**, **Highest Spending Week**, **Lowest Spending Week**, and **Total Planned Meals**.
  - Interactive historical week breakdown with expandable meal summaries and one-tap jump to Planner.
- **⚙️ Preferences & Backup Management:**
  - Configurable currency symbols (`$`, `kr.`, `€`, `£`) and placement (prefix or suffix).
  - Customizable weekly budget targets.
  - **Export to JSON:** Downloadable, timestamped backup file for family archiving or multi-device sharing.
  - **Import from JSON:** Safe file importer with schema validation.
  - Reset to realistic sample/demo data anytime.
- **📱 Native Mobile Experience:**
  - Mobile app shell with sticky top header and bottom tab navigation.
  - Touch-optimized tap targets (>= 44px) and safe-area insets padding (`env(safe-area-inset-bottom)`).
  - Responsive layout: fluid full-bleed on mobile screens, elegant centered frame on desktop displays.

---

## 🛠️ Tech Stack

- **Framework:** React 18+ & TypeScript
- **Bundler:** Vite 5+ (configured with subpath relative asset resolution)
- **Styling:** Tailwind CSS with custom emerald brand palette
- **Icons:** Lucide React
- **Visualizations:** Recharts (responsive SVG charts)
- **Storage:** Browser `localStorage` API (zero external database)
- **CI/CD & Hosting:** GitHub Actions & GitHub Pages

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/kris/madplan.git
cd madplan

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build
```bash
# Type check and build static production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Deployment to GitHub Pages

This repository includes an automated GitHub Actions deployment workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Enabling GitHub Pages in Repository Settings:
1. Navigate to your repository on GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push any commit to the `main` branch, and the site will automatically build and publish to `https://<your-username>.github.io/madplan/`.

---

## 🗄️ Data Model

All user data is stored under the `madplan_db_v1` key in `localStorage` following this schema:

```typescript
export interface AppDatabase {
  version: number;
  currentWeekId: string;
  weeks: Record<string, WeekPlan>;
  settings: {
    currencySymbol: string;
    currencyPosition: 'prefix' | 'suffix';
    theme: 'light' | 'dark' | 'system';
  };
}

export interface WeekPlan {
  id: string; // e.g. "2026-W40"
  weekNumber: number;
  year: number;
  meals: MealEntry[];
  totalSpent: number;
  budgetGoal?: number;
  updatedAt: string;
}

export interface MealEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  course: string;
  cost: number;
  ingredients: { id: string; name: string; isPurchased?: boolean }[];
  notes?: string;
}
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
