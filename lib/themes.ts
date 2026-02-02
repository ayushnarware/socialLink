export interface Theme {
  id: string
  name: string
  isPremium: boolean
  preview: string
  colors: {
    background: string
    text: string
    accent: string
    buttonBg: string
    buttonText: string
  }
  fontFamily: string
  buttonStyle: "rounded" | "pill" | "sharp"
}

export const THEMES: Theme[] = [
  // Free Themes (5 beautiful free themes)
  {
    id: "midnight",
    name: "Midnight",
    isPremium: false,
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    colors: {
      background: "#1a1a2e",
      text: "#eaeaea",
      accent: "#e94560",
      buttonBg: "#e94560",
      buttonText: "#ffffff",
    },
    fontFamily: "Inter, sans-serif",
    buttonStyle: "rounded",
  },
  {
    id: "snow",
    name: "Snow White",
    isPremium: false,
    preview: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    colors: {
      background: "#f8f9fa",
      text: "#212529",
      accent: "#228be6",
      buttonBg: "#228be6",
      buttonText: "#ffffff",
    },
    fontFamily: "Inter, sans-serif",
    buttonStyle: "rounded",
  },
  {
    id: "emerald",
    name: "Emerald",
    isPremium: false,
    preview: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    colors: {
      background: "#064e3b",
      text: "#ecfdf5",
      accent: "#34d399",
      buttonBg: "#10b981",
      buttonText: "#ffffff",
    },
    fontFamily: "Inter, sans-serif",
    buttonStyle: "pill",
  },
  {
    id: "slate",
    name: "Slate",
    isPremium: false,
    preview: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    colors: {
      background: "#1e293b",
      text: "#f1f5f9",
      accent: "#38bdf8",
      buttonBg: "#0ea5e9",
      buttonText: "#ffffff",
    },
    fontFamily: "Inter, sans-serif",
    buttonStyle: "rounded",
  },
  {
    id: "rose",
    name: "Rose Garden",
    isPremium: false,
    preview: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    colors: {
      background: "#fdf2f8",
      text: "#831843",
      accent: "#ec4899",
      buttonBg: "#db2777",
      buttonText: "#ffffff",
    },
    fontFamily: "Inter, sans-serif",
    buttonStyle: "pill",
  },

  // Premium Themes (6 pro themes)
  {
    id: "aurora",
    name: "Aurora Borealis",
    isPremium: true,
    preview: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
    colors: {
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
      text: "#e0e7ff",
      accent: "#818cf8",
      buttonBg: "#6366f1",
      buttonText: "#ffffff",
    },
    fontFamily: "Poppins, sans-serif",
    buttonStyle: "pill",
  },
  {
    id: "sunset",
    name: "Sunset Paradise",
    isPremium: true,
    preview: "linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #f97316 70%, #dc2626 100%)",
    colors: {
      background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
      text: "#fff7ed",
      accent: "#fdba74",
      buttonBg: "#f97316",
      buttonText: "#ffffff",
    },
    fontFamily: "Montserrat, sans-serif",
    buttonStyle: "rounded",
  },
  {
    id: "ocean",
    name: "Deep Ocean",
    isPremium: true,
    preview: "linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)",
    colors: {
      background: "linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)",
      text: "#e0f2fe",
      accent: "#38bdf8",
      buttonBg: "#0284c7",
      buttonText: "#ffffff",
    },
    fontFamily: "Roboto, sans-serif",
    buttonStyle: "rounded",
  },
  {
    id: "neon",
    name: "Neon Nights",
    isPremium: true,
    preview: "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)",
    colors: {
      background: "#0a0a0a",
      text: "#f0abfc",
      accent: "#d946ef",
      buttonBg: "#a855f7",
      buttonText: "#ffffff",
    },
    fontFamily: "'Space Grotesk', sans-serif",
    buttonStyle: "sharp",
  },
  {
    id: "forest",
    name: "Enchanted Forest",
    isPremium: true,
    preview: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
    colors: {
      background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
      text: "#dcfce7",
      accent: "#4ade80",
      buttonBg: "#22c55e",
      buttonText: "#ffffff",
    },
    fontFamily: "Lato, sans-serif",
    buttonStyle: "pill",
  },
  {
    id: "royal",
    name: "Royal Purple",
    isPremium: true,
    preview: "linear-gradient(135deg, #3b0764 0%, #581c87 50%, #7c3aed 100%)",
    colors: {
      background: "linear-gradient(135deg, #3b0764 0%, #581c87 50%, #7c3aed 100%)",
      text: "#f5f3ff",
      accent: "#c4b5fd",
      buttonBg: "#8b5cf6",
      buttonText: "#ffffff",
    },
    fontFamily: "Playfair Display, serif",
    buttonStyle: "rounded",
  },
]

export function canAccessTheme(theme: Theme, userPlan: string): boolean {
  if (!theme.isPremium) return true
  return userPlan === "pro" || userPlan === "business"
}

export function getThemeById(themeId: string): Theme | undefined {
  return THEMES.find((t) => t.id === themeId)
}
