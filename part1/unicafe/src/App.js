import { useState } from 'react'

const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
};

const StatisticLine = ({ category, data }) => {
  return (
    <tr>
      <td>{category}</td>
      <td>{data}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  if (all === 0) {
    return <div>No feedback given</div>
  }

  const average = (good - bad)/all;
  const positive = 100 * good/all + ' %';

  return (
    <table>
      <tbody>
        <StatisticLine category='good' data={good} />
        <StatisticLine category='neutral' data={neutral} />
        <StatisticLine category='bad' data={bad} />
        <StatisticLine category='all' data={all} />
        <StatisticLine category='average' data={average} />
        <StatisticLine category='positive' data={positive} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);


  return (
    <div>
      <Header text='give feedback' />
      <div>
        <Button handleClick={() => setGood(good + 1)} text='good' />
        <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
        <Button handleClick={() => setBad(bad + 1)} text='bad' />
      </div>

      <Header text='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
};

export default App
