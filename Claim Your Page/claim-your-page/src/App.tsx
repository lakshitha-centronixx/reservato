import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Claim from "./pages/Claim/Claim";
import NotFound from "./pages/NotFound/NotFound";
import Layout from "./components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import { Edit } from "./pages/Edit/Edit";
import Update from "./pages/Update/Update";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/claim/:id" element={<Claim />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/update/:id" element={<Update />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer stacked hideProgressBar autoClose={1500} closeButton={false} draggable />
    </BrowserRouter>
  )
}

export default App
