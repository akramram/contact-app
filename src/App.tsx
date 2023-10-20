import './App.css';
import ContactList from './components/ContactList'
import CreateContact from './components/CreateContact';

function App() {
  return (
    <div className="App">
      <div>
        <h2>My first Apollo app 🚀</h2>
        <CreateContact />
        <ContactList />
      </div>
    </div>
  );
}

export default App;
