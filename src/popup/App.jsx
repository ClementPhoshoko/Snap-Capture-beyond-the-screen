import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CaptureProgress from "./pages/CaptureProgress";

function App() {
  const [page, setPage] = useState("home");

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {page === "home" && (
          <Home
            key="home"
            onStartCapture={() => setPage("capture")}
          />
        )}
        {page === "capture" && (
          <CaptureProgress
            key="capture"
            onBack={() => setPage("home")}
            onClose={() => setPage("home")}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
