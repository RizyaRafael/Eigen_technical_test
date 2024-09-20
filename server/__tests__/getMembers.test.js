const app = require("../app");
const request = require("supertest")
const { Book, BookBorrow, Member, sequelize } = require('../models/index')

let members = require('../data/members.json')

beforeAll(async () => {
    members = members.map((el) => {
        el.createdAt = el.updatedAt = new Date()
        return el
    })
    await Member.bulkCreate(members)
})

afterAll(async () => {
    await Member.destroy({
        where: {},
        truncate: true,
        restartIdentity: true,
        cascade: true
    });
})

describe("GET /getMembers", () => {
    test('Success get all members', async () => {
        const response = await request(app).get('/getMembers')
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data[0]).toHaveProperty("code", expect.any(String))
        expect(response.body.data[0]).toHaveProperty("name", expect.any(String))
        expect(response.body.data[0]).toHaveProperty("totalBook", "0")
    })
})