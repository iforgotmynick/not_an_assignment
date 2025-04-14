#  Not-an-Assignment

An interactive Angular 19 data visualization app featuring **circle packing diagrams** using D3.js. The app displays hierarchical population/land area data for European countries and regions with smooth signal-based state management and scalable SVG rendering.

Built with:
- Angular 19 (standalone components, signals, OnPush)
- D3.js (circle packing, scales, selections)
- TypeScript + Jasmine + Karma
- Prettier + ESLint (flat config)

---

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run dev server**
   ```bash
   npm start
   ```
3. **Additional features**
   ```bash
   npm test // run unit tests
   npm test --code-coverage // run unit tests with code coverage
   npm run lint // run ESLint
   npm run format // use prettier
   ```

## Directory structure

<pre><code>
src/
├── app/
│   ├── core/               # Models and services
│   ├── features/
│   │   └── circle-packing/ # Component + service + utils
│   ├── shared/             # Reusable UI components
│   ├── app.component.ts
│   └── app.config.ts
├── assets/
├── styles.scss
└── main.ts
</code></pre>
