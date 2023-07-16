import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const Header = ({ text }) => <h1>{text}</h1>;

const DeleteButton = ({ handler }) => <button onClick={handler}>delete</button>;

const Person = ({ person, handler }) => {
  return (
    <div>{person.name} {person.number} <DeleteButton id={person.id} handler={handler}/></div>
  );
};

const Display = ({ list, handler }) => {
  return (
    <>
      {list.map(person => {
        return (
          <Person
            key={person.name}
            person={person}
            handler={handler(person.id, person.name)}
          />
        )
      })}
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
  const [allNames, setAllNames] = useState({});
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [query, setQuery] = useState('');

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
      if (window.confirm(`Delete ${name}?`)) {
        phonebookService.deleteById(id)
          .then(response => {
            setPersons(persons.filter(p => p.id !== id));

            const allNamesUpdated = { ...allNames };
            delete allNamesUpdated[name];
            setAllNames(allNamesUpdated);
          });
      }
    };
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
