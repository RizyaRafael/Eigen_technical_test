const app = require("../app");
const request = require("supertest")
const { Book, BookBorrow, Member, sequelize } = require('../models/index')

let books = require('../data/books.json')
let members = require('../data/members.json')

beforeAll(async () => {
    members = members.map((el) => {
        el.createdAt = el.updatedAt = new Date()
        return el
    })
    await Member.bulkCreate(members)

    books = books.map((el) => {
        el.createdAt = el.updatedAt = new Date()
        return el
    })
    await Book.bulkCreate(books)
    const today = new Date();
    const eightDaysAgo = new Date(today);
    eightDaysAgo.setDate(today.getDate() - 7);

    const borrowedBook = [
        {
            memberCode: "M001",
            bookCode: "JK-45",
            createdAt: eightDaysAgo,
            updatedAt: new Date()
        },
        {
            memberCode: "M002",
            bookCode: "SHR-1",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]
    await BookBorrow.bulkCreate(borrowedBook)
})

afterAll(async () => {
    await Member.destroy({
        where: {},
        truncate: true,
        restartIdentity: true,
        cascade: true
    });
    await Book.destroy({
        where: {},
        truncate: true,
        restartIdentity: true,
        cascade: true
    });
    await BookBorrow.destroy({
        where: {},
        truncate: true,
        restartIdentity: true,
        cascade: true
    });
})

describe("post /returnBook", () => {
    test('Success return member book', async () => {
        body = {
            memberCode: `M002`,
            bookCode: 'SHR-1'
        }
        const response = await request(app).post('/returnBook').send(body)
        expect(response.status).toBe(201)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('data', 'Book succecfully returend')
    }),
    test('Fail because of missing member or book code', async () => {
        body = {
            bookCode: 'SHR-1'
        }
        const response = await request(app).post('/returnBook').send(body)
        expect(response.status).toBe(422)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', 'Member and book code required')
    }),
    test('Fail because of no correlation between book or member', async () => {
        body = {
            memberCode: `M002`,
            bookCode: 'TW-11'
        }
        const response = await request(app).post('/returnBook').send(body)
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', 'Member does not borrow the book')
    }),
    test('Success but the member get penalize so the user status got changed', async () => {
        body = {
            memberCode: `M001`,
            bookCode: 'JK-45'
        }
        const response = await request(app).post('/returnBook').send(body)
        expect(response.status).toBe(201)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('data', 'Book returned passed deadline, you have been penalized for 3 days')
    })
})