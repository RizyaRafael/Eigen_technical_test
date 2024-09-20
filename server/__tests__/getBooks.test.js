const app = require("../app");
const request = require("supertest")
const { Book, BookBorrow, Member, sequelize } = require('../models/index')

let books = require('../data/books.json')

beforeAll(async () => {
    books = books.map((el) => {
        el.createdAt = el.updatedAt = new Date()
        return el
    })
    await Book.bulkCreate(books)
})

afterAll(async () => {
    await Book.destroy({
        where: {},
        truncate: true,
        restartIdentity: true,
        cascade: true
    });
})

describe("GET /getBooks", () => {
    test('Success get all books', async () => {
        const response = await request(app).get('/getBooks')
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.data).toBeInstanceOf(Array)
        expect(response.body.data[0]).toHaveProperty("code", expect.any(String))
        expect(response.body.data[0]).toHaveProperty("title", expect.any(String))
        expect(response.body.data[0]).toHaveProperty("author", expect.any(String))
        expect(response.body.data[0]).toHaveProperty("stock", expect.any(Number))
    })
})