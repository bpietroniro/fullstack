import { useState, useEffect } from 'react'
import axios from 'axios'

const Header = ({ text }) => <h1>{text}</h1>;

const Person = ({ person }) => {
  return (
    <div>{person.name} {person.number}</div>
  );
};

const Display = ({ list }) => {
  return (
    <>
      {list.map(person => <Person key={person.name} person={person} />)}
    </>
  );
};

const InputField = ({ text, value, handler }) => {
  return (
    <div>
      {text} <input value={value} onChange={handler} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [allNames, setAllNames] = useState({ 'Arto Hellas': true });
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    if (allNames[newName]) {
      alert(`${newName} already has an entry in the phonebook.`);
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };
    const allNamesUpdated = { ...allNames };
    allNamesUpdated[newName] = true;

    setPersons(persons.concat(newPerson));
    setAllNames(allNamesUpdated);
    setNewName('');
    setNewNumber('');
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

  return (
    <div>
      <Header text='Phonebook' />
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
      <Display list={query ? persons.filter(person => {
        return person.name.toLowerCase().includes(query.toLowerCase())
      }) : persons } />
    </div>
  )
}

export default App
