import { useState } from 'react';

import HeroesList from '../heroesList/HeroesList';
import HeroesAddForm from '../heroesAddForm/HeroesAddForm';
import HeroesFilters from '../heroesFilters/HeroesFilters';

import './app.scss';



const App = () => {

    const [filter, setFilter] = useState('all');

    const onFilterSelected = (filter) => {
        setFilter(filter);
        console.log(filter);
    }

    return (
        <main className="app">
            <div className="content">
                <HeroesList filter={filter}/>
                <div className="content__interactive">
                    <HeroesAddForm/>
                    <HeroesFilters onFilterSelected={onFilterSelected}/>
                </div>
            </div>
        </main>
    )
}

export default App;