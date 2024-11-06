import { RouterProvider } from 'react-router-dom';
import { router } from './config/router';

function App() {
    return (
        <div className="bg-zinc-950 h-screen dark">
            <RouterProvider router={router} />
        </div>
        
    );
}

export default App;
