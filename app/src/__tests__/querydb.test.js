const query = require('../querydb');

it('should return non empty json', () => {
    query.searchForText("").then((data) => {
        expect(data).toBeDefined()
    });
});