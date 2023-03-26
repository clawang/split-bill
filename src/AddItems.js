import React, { useEffect, useState, useRef } from 'react';

let itemCounter = 0;

function AddItems(props) {

	const addItem = (event) => {
		event.preventDefault();

		props.setItems([...props.items, new Item(itemCounter++)]);
	}

	const updateTax = (event) => {
		props.setTax(parseFloat(event.target.value));
	}

	const updateTip = (event) => {
		props.setTip(parseFloat(event.target.value));
	}

	const removeItem = (id) => {
		const newItems = [...props.items];
		newItems.splice(id, 1);
		props.setItems(newItems);
	}

	return (
		<div className="items-wrapper">
			<h2>Items</h2>
			<h4>Add all the items on the bill.</h4>
			<div className="container">
				{props.items.map((item, id) => <ItemInput key={item.id} item={item} removeItem={() => removeItem(id)} people={props.people} />)}
				<button onClick={addItem}>+ Add Item</button>
				<label className="extras">
					Tax: 
					<input type="number" value={props.tax} onChange={updateTax} placeholder="Tax"/>
				</label>
				<label className="extras">
					Tip: 
					<input type="number" value={props.tip} onChange={updateTip} placeholder="Tip"/>
				</label>
			</div>
		</div>
	);
}

function ItemInput(props) {
	const [name, setName] = useState(props.item.name);
	const [price, setPrice] = useState(props.item.price);
	const [checked, setChecked] = useState(props.item.people.length);
	const [done, setDone] = useState(false);

	useEffect(() => {
		props.item.name = name;
		props.item.price = parseFloat(price);
	}, [name, price, checked]);

	return (
		<div className="item-wrapper">
			<input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name"/>
			<input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price"/>
			<div className="people-selection-wrapper">
				<p>Who should this be split with?</p>
				{props.people.map((p, id) => <PeopleSelection key={id} item={props.item} person={p} checked={checked} setChecked={setChecked} />)}
			</div>
			<button className="remove" onClick={props.removeItem}>X</button>
		</div>
	);
}

function PeopleSelection(props) {
	const [isChecked, setIsChecked] = useState(props.item.people.includes(props.person.id));

	useEffect(() => {
		if (isChecked) {
			props.item.addPerson(props.person.id);
			props.setChecked(props.checked+1);
		} else {
			props.item.removePerson(props.person.id);
			props.setChecked(Math.max(props.checked-1, 0));
		}
	}, [isChecked]);

	const handleOnChange = () => {
		setIsChecked(!isChecked);
	};

	return (
		<label>
			<input
				type="checkbox"
				id="name"
				name="topping"
				value={props.person.name}
				checked={isChecked}
				onChange={handleOnChange}
			/>{props.person.name}
		</label>
	);
}

class Item {
	constructor(id) {
		this.id = 1000+id;
		this.people = [];
		this.name = "";
		this.price = null;
	}

	addPerson(person) {
		if (this.people.findIndex(p => p === person) < 0) {
			this.people.push(person);
		}
	}

	removePerson(person) {
		const index = this.people.findIndex(p => p === person);
		if(index >= 0) this.people.splice(index, 1);
	}

	isFilled() {
		return Boolean(this.people.length > 0 && this.price);
	}

	validatePeople(peopleRef) {
		this.people = this.people.filter(p => peopleRef.findIndex(ref => ref.id === p) >= 0);
	}
}

export {AddItems, Item};