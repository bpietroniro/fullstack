const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  );
};

const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part part={props.parts[0]} exercises={props.exercises[0]} />
      <Part part={props.parts[1]} exercises={props.exercises[1]} />
      <Part part={props.parts[2]} exercises={props.exercises[2]} />
    </div>
  );
};

const Total = (props) => {
  return (
    <p>
      Number of exercises {props.nums.reduce((sum, n) => sum + n, 0)}
    </p>
  );
};

const App = () => {
  const course = 'Half Stack application development';
  const exercises = [10, 7, 14];
  const parts = [
    'Fundamentals of React',
    'Using props to pass data',
    'State of a component'
  ];

  return (
    <div>
      <Header course={course} />
      <Content exercises={exercises} parts={parts} />
      <Total nums={exercises} />
    </div>
  );
};

export default App
