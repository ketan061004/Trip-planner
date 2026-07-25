import { TripProvider } from "../../context/TripContext";
import ProgressIndicator from "../../components/wizard/ProgressIndicator";

export const metadata = { title: "Plan your trip · AI Trip Planner" };

export default function PlanLayout({ children }) {
  return (
    <TripProvider>
      <ProgressIndicator />
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </TripProvider>
  );
}
