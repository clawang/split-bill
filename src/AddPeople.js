import React, { useEffect, useState, useRef } from 'react';

let peopleCounter = 0;

function AddPeople(props) {

	const addPerson = (event) => {
		event.preventDefault();

		props.setPeople([...props.people, new Person(peopleCounter++)]);
	}

	return (
		<div className="wrapper">
			<h2>People</h2>
			<h4>Add all the people you split this bill with (including yourself).</h4>
			<div className="container">
				{props.people.map((p, id) => <PersonInput person={p} people={props.people} setPeople={props.setPeople} id={id} key={p.id} />)}
				<button onClick={addPerson}>+ Add New Person</button>
			</div>
		</div>
	);
}

function PersonInput(props) {
	const [name, setName] = useState(props.person.name || "");

	const updateName = (event) => {
		setName(event.target.value);
		props.person.setName(event.target.value);
	}

	const removePerson = () => {
		const newPeople = [...props.people];
		newPeople.splice(props.id, 1);
		props.setPeople(newPeople);
	}

	return (
		<div className="label">
			<input type="text" value={name} onChange={updateName} placeholder="Name"/>
			<button onClick={removePerson}>X</button>
		</div>
	);
}

class Person {
	constructor(id) {
		this.id = id;
		this.total = 0;
		this.name = null;
	}

	setName(name) {
		this.name = name;
	}

	setPrice(price) {
		this.total = price;
	}

	isFilled() {
		return Boolean(this.name);
	}
}

export {AddPeople, Person};