import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";

import {useHttp} from '../../hooks/http.hook';
import { heroAdd } from '../heroesList/heroesSlice';


const HeroesAddForm = () => {

    const {request} = useHttp();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [element, setElement] = useState('');
    const [adding, setAdding] = useState(false);

    const {filters} = useSelector(state => state.filters);
    const dispatch = useDispatch();

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

        request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
            .then(dispatch(heroAdd(hero)))
            .catch(error => console.log(error))
            .finally(() => setAdding(false));

        setName('');
        setDescription('');
        setElement('');
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
                    {/* <option value="fire">Огонь</option>
                    <option value="water">Вода</option>
                    <option value="wind">Ветер</option>
                    <option value="earth">Земля</option> */}
                    {filtersList}
                </select>
            </div>

            { !adding && <button type="submit" className="btn btn-primary">Создать</button>}
            { adding && <button type="submit" disabled className="btn btn-primary">Создаем нового героя...</button>}
        </form>
    )
}

export default HeroesAddForm;