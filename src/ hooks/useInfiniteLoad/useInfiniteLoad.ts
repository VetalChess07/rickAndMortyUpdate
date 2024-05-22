import { useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client"


export const useInfiniteLoad = (endpoint, vars, setData, storeData,  setHasMoreData, hasMoreData, setPage) =>{

   const { data, loading, error } = useQuery(
        endpoint,
        {
           variables: { ...vars },
           fetchPolicy: 'cache-first',
        },
     );

     useEffect(() => {
        if (data && data.characters.results.length > 0) {         
           const newCharacters = data.characters.results;
           const prevPage = data.characters.info.prev;
              
         if(prevPage + 1){

            setData(prevCharacters => [
               ...prevCharacters,
               ...newCharacters,
            ]);

             if(storeData.isFilter){
         
            storeData.filteredLoadPostsInfiniteScroll(newCharacters)
          
         }
         else{
            console.log('ggg')
            storeData.loadPosts(newCharacters);
         }
         }
         else{
            setPage(1)
         }

        
           setHasMoreData(data.characters.info.next !== null);
        }
        
     }, [data]);

     const loadMoreCharacters = useCallback(async () => {
        if (loading || !hasMoreData) return;
        setPage(prevPage => prevPage + 1);
     }, [loading, hasMoreData]);
  
   

     return {data, loading, error, loadMoreCharacters}
}