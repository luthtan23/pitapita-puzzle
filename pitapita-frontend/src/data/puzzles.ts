export interface PuzzleOption {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  previewUrl: string;
}

export const PUZZLE_CATEGORIES = ["Nature", "Architecture", "Abstract"] as const;

export const PUZZLES: PuzzleOption[] = [
  {
    id: "nature-forest",
    title: "Mystical Forest",
    category: "Nature",
    imageUrl: "/puzzles/nature_forest.png",
    previewUrl: "/puzzles/nature_forest.png",
  },
  {
    id: "arch-city",
    title: "Neon City",
    category: "Architecture",
    imageUrl: "/puzzles/arch_city.png",
    previewUrl: "/puzzles/arch_city.png",
  },
  {
    id: "abstract-glass",
    title: "Liquid Glass",
    category: "Abstract",
    imageUrl: "/puzzles/abstract_glass.png",
    previewUrl: "/puzzles/abstract_glass.png",
  },
  {
    id: "default-landscape",
    title: "Serene Landscape",
    category: "Nature",
    imageUrl: "/puzzle_landscape.png",
    previewUrl: "/puzzle_landscape.png",
  }
];
