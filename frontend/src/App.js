import { BrowserRouter, Routes, Route } from "react-router-dom";
import Convert from "./pages/Convert";
import Video from './pages/Video';
import './App.css';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" >
          <Route index element={<Convert />} />
          <Route path="*" element={<div class="App-header">No Page</div>} />
          <Route path="video" element={<Video />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
