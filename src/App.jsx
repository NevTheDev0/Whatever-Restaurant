import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import AdminPanel from './Pages/AdminPanel'
import Update from './Components/Update'
import LoginPage from './Components/LoginPage'
import ProtectedRoute from './Components/ProtectedRoute' // 👈 add this

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/admin" element={
                    <ProtectedRoute>   {/* 👈 wrap AdminPanel */}
                        <AdminPanel />
                    </ProtectedRoute>
                } />
                <Route path="/update/:id" element={<Update/>} />
                <Route path="/login" element={<LoginPage/>} />
            </Routes>
        </BrowserRouter>
    )
}
export default App