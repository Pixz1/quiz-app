import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header';
import Home from './Pages/Home';
import Quiz from './Pages/Quiz';
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() 
{
  	return (
		<HashRouter>
			<Header/>	
				<Routes>
					<Route path='/' element={<Home/>}/>
					<Route path='/quiz' element={<Quiz/>}/>
				</Routes>
		</HashRouter>
  	);
}

export default App;
