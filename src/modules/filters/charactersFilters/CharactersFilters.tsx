import React, { useState, useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import debounce from 'lodash.debounce';
import { useStores } from '../../../context/root-store-context';
import FilterPostsInput from '../../../ui/inputs/filterPostsInput/FilterPostsInput';

const CharactersFilters = observer(() => {
  const { characters } = useStores();
  const [name, setName] = useState(characters.filterName);
  const lastNameRef = useRef(name);

  const debouncedLoadCharacters = useCallback(
    debounce((newName) => {
      if (newName.trim() !== '' && newName.trim() !== characters.filterName) {
        characters.setFilterName(newName.trim());
        characters.setIsFilter(true);
      } else if (newName.trim() === '') {
        characters.setFilteredPage(1);
        characters.setFilterName('');
        characters.setIsFilter(false);
      }
    }, 1000),
    [characters]
  );

  useEffect(() => {
    if (lastNameRef.current !== name) {
      debouncedLoadCharacters(name);
      lastNameRef.current = name;
    }
    return () => {
      debouncedLoadCharacters.cancel();
    };
  }, [name, debouncedLoadCharacters]);

  const handleNameChange = (newName) => {
    if (lastNameRef.current !== newName) {
      setName(newName);
      characters.setFilteredPage(1);
      characters.setFilteredCharactersData([]);
    }
  };

  return (
    <div>
      <FilterPostsInput
        value={name}
        setValue={handleNameChange}
        placeholder={'Filter by name...'}
        id={'name'}
      />
      {characters.isFilter ? 'filter!!!' : 'not is filter'}
    </div>
  );
});

export default CharactersFilters;
