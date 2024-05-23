import { useState, useEffect } from 'react';
import { useStores } from '../../../context/root-store-context';
import { useInfiniteLoad } from '../../../ hooks/useInfiniteLoad/useInfiniteLoad';
import InfiniteLoader from 'react-window-infinite-loader';
import PostsInner from '../components/postsInner/PostsInner';
import { observer } from 'mobx-react-lite';
import { getGridSettings } from '../../../utils/functions/getGridSettings';
import { GET_CHARACTERS } from '../../../schemas/characters/query/getCharacters';
import { GET_FILTERCHARACTERS } from '../../../schemas/characters/query/getFilteredCharacters';

const { widthGrid, columnCount, columnWidth } = getGridSettings(window.innerWidth);

const CharactersPosts = observer(() => {
   const { characters } = useStores();
   const [hasMoreCharacters, setHasMoreCharacters] = useState(true);

   const vars = {
      page: characters.page,
      name: characters.isFilter ? characters.filterName : undefined,
      species: characters.species ? characters.species : undefined,
   };

   const endpoint = characters.isFilter ? GET_FILTERCHARACTERS : GET_CHARACTERS;

   useEffect(() => {
      characters.setPage(1);
      characters.setCharactersData([]);
     

      return () => {
         characters.setPage(1);
         characters.setCharactersData([]);
      };
   }, [characters.isFilter, characters.filterName, characters, characters.species]);

 
  
   const isCharacterLoaded = index => index < characters.charactersData.length;
   const rowCount = Math.ceil(characters.charactersData.length / columnCount);

  const { loadMoreCharacters, error, loading, data, refetch  } = useInfiniteLoad(
      endpoint,
      vars,
      characters,
      setHasMoreCharacters,
      hasMoreCharacters
   );

   useEffect(()=>{
    
      if(data){
         const nextPage = data.characters.info.next;
         if(nextPage){
            console.log(hasMoreCharacters, " has" )
            console.log(nextPage)
            // refetch()
            // const errorTimeout = setTimeout(() => {
            //    loadMoreCharacters(); // Запускаем повторный запрос через задержку
            // }, 5000); // Устанавливаем задержку в 5 секунд (можно изменить по вашему усмотрению)
   
            // return () => clearTimeout(errorTimeout);
         }
      }
      if(error){
         loadMoreCharacters()
      }
    
   },[error, data, loading, loadMoreCharacters])



   return (
      <>
      {loading && "load..."}
         {characters.charactersData.length} === {characters.page}
       
         {error && "error 123"}
         <InfiniteLoader
            isItemLoaded={isCharacterLoaded}
            itemCount={characters.charactersData.length * 2}
            loadMoreItems={loadMoreCharacters}
         >
            {({ onItemsRendered, ref }) => (
               <PostsInner
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={1000}
                  rowCount={rowCount}
                  widthGrid={widthGrid}
                  onItemsRendered={onItemsRendered}
                  reference={ref}
                  data={characters.charactersData}
               />
            )}
         </InfiniteLoader>
      </>
   );
});

export default CharactersPosts;
