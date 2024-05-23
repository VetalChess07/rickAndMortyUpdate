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

   useEffect(() => {
      console.log(characters.species)
      characters.setPage(1);
      characters.setCharactersData([]);
     

      return () => {
         characters.setPage(1);
         characters.setCharactersData([]);
      };
   }, [characters.isFilter, characters.filterName, characters, characters.species]);


   const vars = {
      page: characters.page,
      name: characters.isFilter ? characters.filterName : undefined,
      species: characters.species ? characters.species : undefined,
   };

   const endpoint = characters.isFilter ? GET_FILTERCHARACTERS : GET_CHARACTERS;


   const { loadMoreCharacters, error, loading } = useInfiniteLoad(
      endpoint,
      vars,
      characters,
      setHasMoreCharacters,
      hasMoreCharacters
   );

   const isCharacterLoaded = index => index < characters.charactersData.length;
   const rowCount = Math.ceil(characters.charactersData.length / columnCount);

   return (
      <>
         {characters.charactersData.length} === {characters.page}
         <InfiniteLoader
            isItemLoaded={isCharacterLoaded}
            itemCount={hasMoreCharacters ? characters.charactersData.length + columnCount : characters.charactersData.length}
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
