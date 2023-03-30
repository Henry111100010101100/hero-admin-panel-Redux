import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.css';


const HeroesList = () => {

    const {
        data: heroes = [],
        isLoading,
        isError
    } = useGetHeroesQuery();

    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter);

    const filteredHeroes = useMemo(() => {
        const filteredHeroes = heroes.slice();

        if (activeFilter === 'all') {
            return filteredHeroes;
        } else {
            return filteredHeroes.filter(item => item.element === activeFilter)
        }
    }, [heroes, activeFilter])

    const onDeleteHero = useCallback((id) => {

        deleteHero(id);
        // eslint-disable-next-line
    }, [])

    if (isLoading) {
        return <Spinner/>;
    } else if (isError) {
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