export const THEMES = [
  {
    id: "default",
    name: "Default Theme",
    price: 0,
    description: "Classic banana yellow atmosphere.",
    icon: "shield",
    backgroundType: "solid",
    backgroundValue: "#fff06c",
    colors: {
      "--bg-color": "#fff06c",
      "--text-color": "#000000",
      "--accent-color": "#FFD600",
      "--title-color": "#000000"
    }
  },
  {
    id: "dark",
    name: "Dark Ocean",
    price: 50,
    description: "Deep ocean blue theme.",
    icon: "sword",
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(135deg, #00253a, #00eaff)",
    colors: {
      "--bg-color": "#00000000", 
      "--text-color": "#000000",
      "--accent-color": "#00eaff",
      "--title-color": "#ffffff"
    }
  },
  {
    id: "royal",
    name: "Outer galaxy",
    price: 100,
    description: "outer space night background",
    icon: "crown",
    backgroundType: "image",
    backgroundValue: "/src/styles/space-blk.jpg", 
    colors: {
      "--bg-color": "#fff7d1",
      "--text-color": "#444444",
      "--accent-color": "#e4b400",
      "--title-color": "#FFFFFF"
    }
  }
];
