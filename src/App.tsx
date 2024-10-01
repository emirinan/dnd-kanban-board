import "./App.css";
import KanbanBoard from "./components/KanbanBoard";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <>
      <KanbanBoard />;
      <SpeedInsights />;
    </>
  );
}

export default App;
