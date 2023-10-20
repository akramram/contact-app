import './App.css';
import { Button } from './components/Button';
import ContactList from './components/ContactList'

function App() {
  return (
    <div className="App">
      <div>
        <h2>My first Apollo app 🚀</h2>
        <Button />
        <ContactList />
      </div>
    </div>
  );
}

export default App;
