const mongoose = require('mongoose');

const server = require('../src/server');
const request = require('supertest')(server);

describe('DoIt2DayServer REST API', () => {

    const itemsUrl = `${process.env.BASE_PATH || '/api'}/items`;

    beforeAll(async function () {
        await mongoose.connection.createCollection('items')
    });

    afterAll(clearDatabase);

    let testItem = {
        _id: 'temp id',
        title: 'Mock Item',
        description: 'This is a mocked item for testing',
        completed: false,
        urgent: true,
        important: false,
        targetDate: new Date('2020-08-11')
    };

    it(`GET ${itemsUrl} should return no items`, done => {
        request
            .get(itemsUrl)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, [], done);
    });

    it(`POST ${itemsUrl} should create and return new item`, done => {
        request
            .post(itemsUrl)
            .send({
                title: 'Mock Item',
                description: 'This is a mocked item for testing',
                completed: false,
                urgent: true,
                important: false,
                targetDate: new Date('2020-08-11')
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => {
                // check and extract id
                expect(res.body._id).toBeTruthy();
                testItem._id = res.body._id;
            })
            .expect(res => cleanResponse(res))
            .expect(201, testItem, done);
    });

    it(`GET ${itemsUrl} should return array containing created item`, done => {
        request
            .get(itemsUrl)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => cleanResponse(res))
            .expect(200, [testItem], done);
    });

    it(`GET ${itemsUrl}/:id should return created item`, done => {
        request
            .get(`${itemsUrl}/${testItem._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => cleanResponse(res))
            .expect(200, testItem, done);
    });

    it(`PUT ${itemsUrl}/:id should update and return new item`, done => {
        // update test item
        testItem = {
            _id: testItem._id,
            title: 'Updated Mock Item',
            description: 'This is an updated, mocked item for testing',
            completed: false,
            urgent: false,
            important: true,
            targetDate: new Date('2020-01-01')
        }

        request
            .put(`${itemsUrl}/${testItem._id}`)
            .send({
                title: 'Updated Mock Item',
                description: 'This is an updated, mocked item for testing',
                completed: false,
                urgent: false,
                important: true,
                targetDate: new Date('2020-01-01')
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => cleanResponse(res))
            .expect(200, testItem, done);
    });

    it(`GET ${itemsUrl}/:id should return updated item`, done => {
        request
            .get(`${itemsUrl}/${testItem._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(res => cleanResponse(res))
            .expect(200, testItem, done);
    });

    it(`DELETE ${itemsUrl}/:id should delete item`, done => {
        request
            .delete(`${itemsUrl}/${testItem._id}`)
            .set('Accept', 'application/json')
            .expect(204, '', done);
    });

    it(`GET ${itemsUrl} should return no items`, done => {
        request
            .get(itemsUrl)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, [], done);
    });

    // TODO implement error handling/handling not found
    xdescribe('error cases:', () => {

        const fakeId = '000000000000000000000000';

        it(`PUT ${itemsUrl}/:fakeId should return 404`, done => {
            request
                .put(`${itemsUrl}/${fakeId}`)
                .send({
                    title: 'Updated Mock Item',
                    description: 'This is an updated, mocked item for testing',
                    completed: false,
                    urgent: false,
                    important: true,
                    targetDate: new Date('2020-01-01')
                })
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(404, done);
        });

        it(`GET ${itemsUrl}/:fakeId should return 404`, done => {
            request
                .get(`${itemsUrl}/${fakeId}`)
                .set('Accept', 'application/json')
                .expect(404, done);
        });

        it(`DELETE ${itemsUrl}/:fakeId should return 404`, done => {
            request
                .delete(`${itemsUrl}/${fakeId}`)
                .set('Accept', 'application/json')
                .expect(404, done);
        });

    });

});

function cleanResponse(res) {
    if (Array.isArray(res.body)) {
        for (let i = 0; i < res.body.length; i++) {
            delete res.body[i].__v;
            res.body[i].targetDate = new Date(res.body[i].targetDate.toString());
        }
    } else {
        delete res.body.__v;
        res.body.targetDate = new Date(res.body.targetDate.toString());
    }
}

function clearDatabase() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Attempt to clear production database!');
    }

    for (let collection in mongoose.connection.collections) {
        mongoose.connection.dropCollection(collection);
    }
}
