import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Display from './components/Display'
import Notification from './components/Notification'
import './index.css'

const Header = ({ text }) => <h1>{text}</h1>;

const InputField = ({ text, value, handler }) => {
  return (
    <div>
      {text} <input value={value} onChange={handler} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [allNames, setAllNames] = useState({});
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => {
        setPersons(response.data);
        setAllNames(response.data.reduce((obj, person) => {
            obj[person.name] = true;
            return obj;
          }, {})
        );
      });
  }, []);

  const displayMessage = (message) => {
    setMessage(message);
    setTimeout(() => setMessage(null), 5000);
  };

  const addName = (event) => {
    event.preventDefault();
    if (allNames[newName]) {
      if (window.confirm(`${newName} already has an entry in the phonebook. Update entry?`)) {
        updateNumber();
      }
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    phonebookService
      .create(newPerson)
      .then(response => {
        const allNamesUpdated = { ...allNames };
        allNamesUpdated[newName] = true;
        setPersons(persons.concat(response.data));
        setAllNames(allNamesUpdated);
        setNewName('');
        setNewNumber('');
        displayMessage(`${newName} was added to the phonebook.`);
      });
  };

  const updateNumber = () => {
    const id = persons.find(p => p.name === newName).id;

    const updatedPerson = {
      name: newName,
      number: newNumber,
    };

    phonebookService
      .update(id, updatedPerson)
      .then(response => {
        setPersons(persons.map(p => p.id !== id ? p : response.data));
        setNewName('');
        setNewNumber('');
        displayMessage(`${newName}'s number was updated.`);
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  
  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleDelete = (id, name) => {
    return () => {
      if (window.confirm(`Delete ${name} from the phonebook?`)) {
        phonebookService.deleteById(id)
          .then(response => {
            setPersons(persons.filter(p => p.id !== id));

            const allNamesUpdated = { ...allNames };
            delete allNamesUpdated[name];
            setAllNames(allNamesUpdated);
            setMessage(`${name} was deleted from the phonebook.`);
          });
      }
    };
  };

  return (
    <div>
      <Header text='Phonebook' />
      <Notification message={message} />
      <InputField 
        text='filter shown with' 
        value={query} 
        handler={handleQueryChange}
      />
      <Header text='Add new' />
      <form onSubmit={addName}>
        <InputField 
          text='name:'
          value={newName} 
          handler={handleNameChange}
        />
        <InputField 
          text='number:'
          value={newNumber} 
          handler={handleNumberChange}
        />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <Header text='Numbers' />
      <Display 
        list={query ? persons.filter(person => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        }) : persons }
        handler={handleDelete}
      />
    </div>
  )
}

export default App
