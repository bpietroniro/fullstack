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

export default Display
