import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.scss';
import {AddPeople, Person} from './AddPeople';
import {AddItems, Item} from './AddItems';


function App() {
  const [stage, setStage] = useState(0);
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);
  const [submit, setSubmit] = useState(0);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    if (stage === 1) {
      items.forEach(item => item.validatePeople(people));
    } else if (stage === 2) {
      calculateTotal();
    }
  }, [stage]);

  // console.log(people);
  // console.log(items);

  const calculateTotal = () => {
    const totals = {};
    const extra = (tax + tip) / people.length;
    for (const person of people) {
      totals[person.id] = extra;
    }

    for (const item of items) {
      const cost = item.price / item.people.length;
      item.people.forEach(p => totals[p] += cost);
    }

    people.forEach((person)  => person.setPrice(Math.round(totals[person.id] * 100) / 100));
    setPeople([...people]);
  }

  const navBack = (event) => {
    event.preventDefault();
    setSubmit(0);
    setStage(stage-1);
  }

  const navForward = (event) => {
    event.preventDefault();
    if ((stage === 0 && people.length <= 0) ||
        (stage === 1 && items.length <= 0)) {
      setSubmit(2);
    } else if ((stage === 0 && checkPeople()) ||
      (stage === 1 && checkItems())) {
      setSubmit(0);
      setStage(stage+1);
    } else {
      setSubmit(1);
    }
  }

  const checkItems = () => {
    return items.reduce((accumulator, currentValue) => {
        return Boolean(accumulator && currentValue.isFilled());
    }, true);
  }

  const checkPeople = () => {
    return people.reduce((accumulator, currentValue) => {
        return Boolean(accumulator && currentValue.isFilled());
    }, true);
  }

  const getClass = () => {
    switch (stage) {
      case 0:
        return 'people';
      case 1:
        return 'items';
      case 2:
        return 'total';
    }
  }

  return (
    <div className={"body " + getClass()}>
      <div className="App">
        <Screen
          people={people}
          setPeople={setPeople}
          items={items}
          setItems={setItems}
          stage={stage}
          setStage={setStage}
          tax={tax}
          setTax={setTax}
          tip={tip}
          setTip={setTip} />
        {
          submit ?
            <div className="error-wrapper">
            {submit === 1 ?
              <p>Not all fields are filled out.</p>
              :
              <p>You haven't added anything.</p>
            }
            </div>
          :
            <></>
        }
        <div className="button-container">
          {stage > 0 ?
            <div className="back-button" onClick={navBack}>
              <p>Back</p>
            </div>
            :
            <></>
          }
          {stage < 2 ?
            <div className="forward-button" onClick={navForward}>
              <p>Next</p>
            </div>
            :
            <></>
          }
        </div>
      </div>
    </div>
  );
  
}

function Screen(props) {
  if (props.stage === 0) {
    return (
        <AddPeople
          people={props.people}
          setPeople={props.setPeople}
          setStage={props.setStage}
        />
    );
  } else if (props.stage === 1) {
    return (
        <AddItems
          items={props.items}
          setItems={props.setItems}
          people={props.people}
          setStage={props.setStage}
          tax={props.tax}
          setTax={props.setTax}
          tip={props.tip}
          setTip={props.setTip}
        />
    );
  } else {
    return (
      <div className="totals-wrapper">
        <h2>Totals</h2>
        <table>
          <tbody>
            {
              props.people.map(p => {
                return (
                  <tr>
                    <td>{p.name}</td>
                    <td>{`$${p.total}`}</td>
                  </tr>
                  );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
