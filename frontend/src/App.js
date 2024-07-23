import { BrowserRouter, Routes, Route } from "react-router-dom";
import Convert from "./pages/Convert";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" >
          <Route index element={<Convert />} />
          <Route path="*" element={<div>no page lol</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
