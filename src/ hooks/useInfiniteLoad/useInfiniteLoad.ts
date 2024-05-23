import { useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { deleteDublicate } from '../../utils/functions/deleteDublicate';

export const useInfiniteLoad = (endpoint, vars, storeData, setHasMoreData, hasMoreData) => {
 
  const { data, loading, error,refetch } = useQuery(endpoint, {
    variables: { ...vars },
   
  });

  useEffect(() => {
    if (data && data.characters.results.length > 0) {
      const newCharacters = data.characters.results;
    

      storeData.loadPosts(newCharacters)
      
      
     
      setHasMoreData(data.characters.info.next !== null);
    }
  }, [data, storeData, setHasMoreData, hasMoreData]);

  const loadMoreCharacters = useCallback(() => {
    if (loading || !hasMoreData) return;
    console.log('plus')
    storeData.setPagePlusNumber() 
  }, [loading, hasMoreData ]);

  
  return { data, loading, error, loadMoreCharacters,refetch };
}
