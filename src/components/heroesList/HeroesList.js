import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { createSelector } from 'reselect';

import { heroesFetch, heroDelete,} from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.css';


const HeroesList = () => {

    const filteredHeroesSelector = createSelector(
        (state) => state.heroes.heroes,
        (state) => state.filters.activeFilter,
        (heroes, activeFilter) => {
            if (activeFilter === 'all') {
                return heroes;
            } else {
                return heroes.filter(item => item.element === activeFilter)
            }
        }
    )

    const filteredHeroes = useSelector(filteredHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(heroesFetch(request));
        // eslint-disable-next-line
    }, []);

    const onDeleteHero = useCallback((id) => {

        request(`http://localhost:3001/heroes/${id}`, "DELETE")
        .then(data => console.log(data, "deleted"))
        .then(dispatch(heroDelete(id)))
        .catch(error => console.log(error))
        // eslint-disable-next-line
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return(
                <CSSTransition
                timeout={500}
                classNames="hero_item">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return <CSSTransition 
                timeout={500} 
                key={id}
                classNames="hero_item">
                    <HeroesListItem 
                        onDeleteHero={() => onDeleteHero(id)} 
                        {...props}/>
            </CSSTransition>
        })

    }
    
    const elements = renderHeroesList(filteredHeroes);

    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;