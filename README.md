# 🏗️ Construction Master Pro

> A professional-grade field calculator for builders, contractors, and architects — built with React, Vite, and TypeScript.

![Construction Master Pro](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite%20%2B%20TypeScript-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

---

## ✨ Features

Construction Master Pro brings the power of a dedicated jobsite calculator to the browser. Enter real-world dimensions like `12'6 3/4"` and get instant, accurate results — no mental math required.

### 📐 6 Calculation Modes

| Mode | Description |
|------|-------------|
| **Dimensional** | Arithmetic on feet-inches-fractions. Add, subtract, multiply, and divide real-world measurements with full fraction support |
| **Roof / Right Angle** | Enter any 2 of Rise, Run, Diagonal, or Pitch — solves all unknowns including rafter length and angle |
| **Area & Volume** | 2D area (rectangle, circle, triangle) and 3D volume (box, cylinder, cone) with automatic unit conversions |
| **Stairs** | Enter total rise → get number of steps, riser height, tread depth, total run, and IBC code compliance check |
| **Trigonometry** | sin, cos, tan and their inverses with switchable DEG / RAD mode |
| **Cost Estimator** | Quantity × unit cost + waste factor → net, gross, and total material cost |

---

## 🛠️ Tech Stack

- **[React 18](https://react.dev/)** — UI framework
- **[Vite 6](https://vitejs.dev/)** — lightning-fast build tool
- **[TypeScript](https://www.typescriptlang.org/)** — full type safety
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[Lucide React](https://lucide.dev/)** — crisp icon set
- **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** — monospace display font

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/calcu.git
cd calcu

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder, ready to deploy anywhere.

---

## 📱 Usage

### Entering Dimensions

The calculator accepts natural construction notation:

| You type | Means |
|----------|-------|
| `12'6 3/4` | 12 feet, 6 and 3/4 inches |
| `9'` | 9 feet |
| `6"` | 6 inches |
| `0.5` | 0.5 feet (decimal mode) |

Use the **fraction buttons** on the keypad for quick entry of 1/2, 1/4, 3/4, 1/8, 1/16, and more.

### Unit Conversion

Every result automatically displays in all three unit systems:
- **ft-in** → `14' 3 1/2"`
- **Decimal feet** → `14.2917'`
- **Metric** → `4.356 m`

### Memory

Available in Dimensional mode:
- **M+** — store current value
- **MR** — recall stored value
- **MC** — clear memory

---

## 🏠 Roof Calculator Example

Given a **6/12 pitch** roof with a **12' run**:

1. Switch to **Roof** mode
2. Tap **Run** → enter `12'`
3. Tap **Pitch** → enter `6`
4. Press **=**

Results:
- Rise: `6'`
- Diagonal / Rafter: `13' 5 1/2"`
- Angle: `26.57°`

---

## 🪜 Stair Calculator Example

Floor-to-floor height of **9'2"**:

1. Switch to **Stairs** mode
2. Enter `9'2"` as Total Rise
3. Press **=**

Results:
- Steps: **15**
- Riser Height: **7 5/16"** ✓ *(IBC compliant)*
- Tread Depth: **10 3/16"** ✓ *(IBC compliant)*
- Total Run: **12' 9"**
- Stair Angle: **35.7°**

---

## 📁 Project Structure

```
src/
├── components/
│   ├── display/        # DisplayPanel, ResultCard
│   ├── keypad/         # Keypad, NumericKeypad, DimensionKeypad, TrigKeypad
│   ├── layout/         # AppShell, ModeTabs
│   └── modes/          # One component per calculator mode
├── hooks/
│   └── useCalculatorState.ts   # Central useReducer state machine
├── lib/
│   ├── dimensionalParser.ts    # "12'6 3/4" → decimal feet
│   ├── dimensionalFormatter.ts # decimal feet → display strings
│   └── calculators/
│       ├── rightAngle.ts
│       ├── areaVolume.ts
│       ├── stairs.ts
│       ├── trig.ts
│       └── costEstimator.ts
└── types/
    └── index.ts        # Shared TypeScript types
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">Built for the field. Designed for precision.</p>
