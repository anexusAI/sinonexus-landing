@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  --color-brand-teal: #13b5a2;
  --color-brand-orange: #ffba5a;
  --color-brand-dark: #111827;
}

:root {
  --bg: #f9fafb;
  --ink: #111827;
}

body {
  background-color: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
}

.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.serif-italic {
  font-family: var(--font-serif);
  font-style: italic;
}
