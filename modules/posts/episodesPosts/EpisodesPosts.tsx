import { useEffect, useState } from 'react';
import { useStores } from '../../../context/root-store-context';
import { useInfiniteLoad } from '../../../ hooks/useInfiniteLoad/useInfiniteLoad';
import InfiniteLoader from 'react-window-infinite-loader';
import PostsInner from '../components/postsInner/PostsInner';
import EpisodesCard from '../../../ui/cards/episodesCard/EpisodesCard';
import Loader from '../../../ui/loader/Loader';
import ErrorBlock from '../../../ui/errorBlock/ErrorBlock';
import LoaderBox from '../../../ui/loaderBox/LoaderBox';
import { observer } from 'mobx-react-lite';
import { getGridSettings } from '../../../utils/functions/getGridSettings';
import { GET_EPISODES } from '../../../schemas/episodes/query/getEpisodes';
import { GET_FILTERED_EPISODES } from '../../../schemas/episodes/query/getFilteredEpisodes';

import type { EpisodeType } from '../../../types/episodes/episodesType';

const { widthGrid, columnCount, columnWidth, isMobileGridSettings } =
   getGridSettings(window.innerWidth);

let rowHeight = 148;
let rowHeightMobile = 148;

const EpisodesPosts = observer(() => {
   const { episodes } = useStores();

   const [hasMore, setHasMore] = useState(true);
   const vars = {
      page: episodes.page,
      name: episodes.isFilter ? episodes.filterName : '',
   };

   const endpoint = episodes.isFilter ? GET_FILTERED_EPISODES : GET_EPISODES;

   useEffect(() => {
      console.log(episodes.episodesData.length)
      episodes.setPage(1);
      episodes.setEpisodesData([]);

      return () => {
         episodes.setPage(1);
         episodes.setEpisodesData([]);
      };
   }, [episodes.isFilter, episodes.filterName, episodes]);

   const isDataLoaded = index => index < episodes.episodesData.length;
   const rowCount = Math.ceil(episodes.episodesData.length / columnCount);

   const { loadMoreData, error, loading } = useInfiniteLoad({
      nameEndpoint: 'episodes',
      endpoint,
      vars,
      storeData: episodes,
      setHasMore,
      hasMore,
   });

   return (
      <>
       {error && <ErrorBlock message={error.message} name={error.name} />}
         <InfiniteLoader
            isItemLoaded={isDataLoaded}
            itemCount={episodes.episodesData.length * 2}
            loadMoreItems={loadMoreData}
         >
            {({ onItemsRendered, ref }) => (
               <PostsInner<EpisodeType>
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={600}
                  rowCount={rowCount}
                  widthGrid={widthGrid}
                  onItemsRendered={onItemsRendered}
                  reference={ref}
                  data={episodes.episodesData}
                  Component={EpisodesCard}
                  rowHeight={rowHeight}
                  rowHeightMobile={rowHeightMobile}
                  isMobileGridSettings={isMobileGridSettings}
               />
            )}
         </InfiniteLoader>
         <LoaderBox height={50}>{loading && <Loader />}</LoaderBox>
      </>
   );
});

export default EpisodesPosts;
