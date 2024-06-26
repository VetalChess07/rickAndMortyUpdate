import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import debounce from 'lodash.debounce';
import { useStores } from '../../../context/root-store-context';

import Box from '@mui/material/Box';
import InnerFilter from '../components/innerFilter/InnerFilter';
import FilterPostsInput from '../../../ui/inputs/filterPostsInput/FilterPostsInput';

import { episodesApplyFilters } from '../components/functions/episodesApplyFilters';

const styleBox = {
   width: '100%',
   marginBottom: '61px',
   '@media (max-width:600px)': {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      marginBottom: '48px',
      justifyContent: ' space-between',
   },
};

const EpisodesFilters = observer(() => {
   const { episodes } = useStores();
   const [name, setName] = useState(episodes.filterName);

   const debouncedLoadCharacters = useCallback(
      debounce(newName => {
         episodesApplyFilters({
            episodes,
            newName,
         });
      }, 500),
      [episodes],
   );

   useEffect(() => {
      debouncedLoadCharacters(name);
   }, [name, debouncedLoadCharacters]);

   const handleNameChange = newName => {
      setName(newName);
   };

   return (
      <Box sx={styleBox}>
         {episodes.filterName}
         {episodes.isFilter && "filter"}
         <InnerFilter>
            <FilterPostsInput
               value={name}
               setValue={handleNameChange}
               placeholder={'Name or episode (ex.S01E01)...'}
               id={'name'}
               width="500px"
            />
         </InnerFilter>
      </Box>
   );
});

export default EpisodesFilters;
