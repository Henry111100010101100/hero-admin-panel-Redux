import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useAddHeroMutation } from "../../api/apiSlice";
import { selectAll } from "../heroesFilters/filtersSlice";
import store from "../../store";


const HeroesAddForm = () => {

    const [addHero] = useAddHeroMutation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [element, setElement] = useState('');
    const [adding, setAdding] = useState(false);

    const filters = selectAll(store.getState());

    const renderFiltersList = (arr) => {
        if (arr.length === 0) {
            return <option>К сожалению, фильтры не прогрузились, попробуйте перезагрузить страницу</option>
        }

        if(filters && filters.length > 0) {
            return arr.map(({name, id, label}) => {
                if (name === "all") {
                    return
                }
    
                return <option value={name} key={id}>{label}</option>
            })
        }
    }
    
    const filtersList = renderFiltersList(filters);

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleDescription = (e) => {
        setDescription(e.target.value);
    }

    const handleElement = e => {
        setElement(e.target.value);
    }

    const submitNewHero = (e) => {
        e.preventDefault();

        setAdding(true);

        const hero = {
            id: uuidv4(),
            name,
            description,
            element
        }

        addHero(hero).unwrap();
        
        setName('');
        setDescription('');
        setElement('');

        setTimeout(() => {setAdding(false)}, 500)
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={submitNewHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name"
                    value={name} 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    onChange={(e) => handleName(e)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text"
                    value={description} 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    onChange={(e) => handleDescription(e)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={element}
                    onChange={(e) => handleElement(e)}>
                    <option >Я владею элементом...</option>
                    {filtersList}
                </select>
            </div>

            { !adding && <button type="submit" className="btn btn-primary">Создать</button>}
            { adding && <button type="submit" disabled className="btn btn-primary">Создаем нового героя...</button>}
        </form>
    )
}

export default HeroesAddForm;