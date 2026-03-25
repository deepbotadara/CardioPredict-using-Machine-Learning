# ML Cardio Dashboard - UI Installation & Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

```bash
# Navigate to the dashboard directory
cd ml-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
ml-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx      # Reusable button component
│   │   │   └── card.tsx        # Reusable card component
│   │   └── dashboard.tsx       # Main dashboard component
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn for className merging)
│   └── globals.css             # Global styles & Tailwind
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── next.config.ts              # Next.js configuration
```

---

## 🎨 Features

### Dashboard Tabs

1. **Overview Tab**
   - Model Comparison Bar Chart (Accuracy, Precision, Recall, F1, ROC AUC)
   - Confusion Matrix Pie Chart (Random Forest Tuned)
   - Feature Importance Horizontal Bar Chart

2. **Metrics Tab**
   - Detailed metrics for all 3 trained models
   - Individual performance cards for each model
   - Comprehensive metric breakdowns

3. **Predictions Tab**
   - Input form for patient health metrics
   - Fields: Age, Weight, Height, Cholesterol Level
   - Get prediction button (ready for backend integration)

4. **Analysis Tab**
   - Model performance summary
   - Key insights and warnings
   - Recommendations for production deployment

### Key Performance Indicators (KPIs)
- Best Accuracy: 73.2% (Random Forest Tuned)
- Best ROC AUC: 0.798
- Models Trained: 3
- Cross-Validation Stability: ± 0.003

---

## 🛠 Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with server-side rendering
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript

### UI & Styling
- **Shadcn/ui** - High-quality React components
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

### Data Visualization
- **Recharts** - Composable React charting library
- Charts included: Bar, Line, Pie, Area charts

### Additional Libraries
- **clsx** - Conditional class merging
- **tailwind-merge** - Smart CSS merging for Tailwind
- **axios** - HTTP client (ready for API integration)

---

## 📊 Available Charts

### 1. Model Comparison Bar Chart
- Compares 5 metrics across 3 models
- Easy visualization of model performance differences

### 2. Confusion Matrix Pie Chart
- Shows True/False Positives/Negatives distribution
- Color-coded for clarity

### 3. Feature Importance Bar Chart
- Displays top 5 most important features
- Horizontal layout for better readability

---

## 🔌 API Integration (Flask Backend)

This project now uses a Flask API for real model inference.

### 1. Export your trained model
From your notebook, save the tuned model to:

```python
joblib.dump(tuned_rf, "artifacts/best_random_forest_tuned.joblib")
```

### 2. Start Flask backend
```bash
cd flask_api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Flask runs at `http://127.0.0.1:5000`.

If `artifacts/best_random_forest_tuned.joblib` is missing, Flask will try to train a tuned Random Forest automatically from the notebook dataset file `cardio_train_properly_separated_comma.csv`.

You can optionally set dataset/model paths:

```powershell
$env:DATASET_PATH="D:\path\to\cardio_train_properly_separated_comma.csv"
$env:MODEL_PATH="D:\path\to\best_random_forest_tuned.joblib"
```

### 3. Configure frontend URL
Create `.env.local` in project root:

```env
NEXT_PUBLIC_FLASK_API_URL=http://127.0.0.1:5000
```

### 4. Start Next.js frontend
```bash
npm install
npm run dev
```

The prediction form will call Flask `POST /predict` directly.

---

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
- **Netlify**: Push to GitHub, connect repository
- **Docker**: Create Dockerfile and containerize
- **AWS/Azure/GCP**: Use their respective deployment tools

---

## 🎯 Customization

### Change Colors
Edit CSS variables in `src/globals.css`:
```css
--primary: 222.2 47.6% 11.2%;
--secondary: 210 40% 96%;
--accent: 222.2 47.6% 11.2%;
```

### Add New Components
```bash
# Copy button or card component as template
cp src/components/ui/button.tsx src/components/ui/new-component.tsx
```

### Add New Tabs
Edit the tabs array in `src/components/dashboard.tsx`:
```typescript
{['overview', 'metrics', 'predictions', 'analysis', 'new-tab'].map((tab) => (...))}
```

---

## 📝 Environment Variables
Create `.env.local` for environment-specific configuration:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001  # Use different port
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run lint  # Check for issues
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Component Library](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Recharts Documentation](https://recharts.org)

---

## ✅ Features Ready for Implementation

- [ ] Connect to Python ML backend
- [ ] Add authentication/login
- [ ] Store predictions in database
- [ ] Add export to CSV/PDF functionality
- [ ] Real-time model performance monitoring
- [ ] Add user feedback mechanism
- [ ] Implement model versioning display
- [ ] Add data validation on input forms

---

**Last Updated**: January 6, 2026  
**Status**: ✅ Ready for Development & Deployment
