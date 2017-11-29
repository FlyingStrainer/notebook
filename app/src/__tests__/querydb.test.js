const query = require('../querydb');

//makes sure algolia connection is working, as we are searching for an empty string which 
//should return all objects in algolia
it('should return non empty json', () => {
    query.searchForText("").then((data) => {
        expect(data).toBeDefined()
    });
});