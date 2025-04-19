export type MenuItemNutritionType = {
    id: number;
    name: string;
    category: string;
    calories_per_serving: number,
    serving_size: string;
    ingredients: string[];
    allergies: string[]
  };