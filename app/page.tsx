import { SelectedItemsProvider } from "@/context/calorie-tracking-context";
import DiningHallMenu from "./DiningHallMenu";

export default function Home() {
  return (
    <div>
      <SelectedItemsProvider>
        <DiningHallMenu />
      </SelectedItemsProvider>
    </div>
  );
}
