import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PostDetailsPage from './pages/PostDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/post/:id' element={<PostDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
