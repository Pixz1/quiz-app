import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header';
import Home from './Pages/Home';
import Quiz from './Pages/Quiz';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() 
{
  	return (
		<BrowserRouter>
			<Header/>	
				<Routes>
					<Route path='/' element={<Home/>}/>
					<Route path='/quiz' element={<Quiz/>}/>
				</Routes>
		</BrowserRouter>
  	);
}

export default App;
