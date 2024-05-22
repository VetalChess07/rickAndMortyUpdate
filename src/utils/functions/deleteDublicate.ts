export function getUniqueCharacters(arr) {
   const uniqueIds = new Set();
   const uniqueCharacters = [];

   arr.forEach(character => {
       if (!uniqueIds.has(character.id)) {
           uniqueIds.add(character.id);
           uniqueCharacters.push(character);
       }
   });

   return uniqueCharacters;
}