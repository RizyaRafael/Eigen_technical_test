const app = require("../app");
const request = require("supertest")
const { Book, BookBorrow, Member, sequelize } = require('../models/index')

let books = [
    {
        "code": "JK-45",
        "title": "Harry Potter",
        "author": "J.K Rowling",
        "stock": 1
    },
    {
        "code": "SHR-1",
        "title": "A Study in Scarlet",
        "author": "Arthur Conan Doyle",
        "stock": 1
    },
    {
        "code": "TW-11",
        "title": "Twilight",
        "author": "Stephenie Meyer",
        "stock": 1
    },
    {
        "code": "HOB-83",
        "title": "The Hobbit, or There and Back Again",
        "author": "J.R.R. Tolkien",
        "stock": 1
    },
    {
        "code": "NRN-7",
        "title": "The Lion, the Witch and the Wardrobe",
        "author": "C.S. Lewis",
        "stock": 1
    }
]


beforeAll(async () => {
    const today = new Date();
    const threeDaysAhead = new Date(today)
    threeDaysAhead.setDate(today.getDate() + 3);

    const oneDayAgo = new Date(today)
    oneDayAgo.setDate(today.getDate() - 3);
    let members = [
        {
            "code": "M001",
            "name": "Angga",
            "penalized": null
        },
        {
            "code": "M002",
            "name": "Ferry",
            "penalized": threeDaysAhead
        },
        {
            "code": "M003",
            "name": "Putri",
            "penalized": oneDayAgo
        }
    ]
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

describe("post /borrowBook", () => {
    test('Success member borrow book', async () => {
        const body = {
            memberCode: `M001`,
            bookCode: 'JK-45'
        }
        const response = await request(app).post('/borrowBook').send(body)
        expect(response.status).toBe(201)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.data).toHaveProperty('bookCode', 'JK-45')
        expect(response.body.data).toHaveProperty('memberCode', 'M001')
    }),
        test('Fail, member not registered', async () => {
            const body = {
                memberCode: `M06`,
                bookCode: 'HOB-83'
            }
            const response = await request(app).post('/borrowBook').send(body)
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', 'Member not registered')
        }),
        test('Fail, member still penalized', async () => {
            const body = {
                memberCode: `M002`,
                bookCode: 'SHR-1'
            }
            const response = await request(app).post('/borrowBook').send(body)
            expect(response.status).toBe(401)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', 'Member is still penelized')
        }),
        test('Fail, book not found', async () => {
            const body = {
                memberCode: `M001`,
                bookCode: 'SHR-2'
            }
            const response = await request(app).post('/borrowBook').send(body)
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', 'Book not registered')
        }),
        test('Fail, book not available', async () => {
            const body = {
                memberCode: `M001`,
                bookCode: 'JK-45'
            }
            const response = await request(app).post('/borrowBook').send(body)
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', 'Book out of stock')
        }),
        test('Fail, member reach limit ', async () => {
            const bodyOne = {
                memberCode: `M001`,
                bookCode: 'SHR-1'
            }
            const bodyTwo = {
                memberCode: `M001`,
                bookCode: 'TW-11'
            }
            await request(app).post('/borrowBook').send(bodyOne)
            const response = await request(app).post('/borrowBook').send(bodyTwo)
            expect(response.status).toBe(403)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', 'Member has reach the limit of borrowed book')
        })
})