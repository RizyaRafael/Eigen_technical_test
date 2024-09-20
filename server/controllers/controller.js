const { Op, Sequelize, fn } = require('sequelize')
const { Book, BookBorrow, Member } = require('../models/index')
class Controller {
    static async borrowBook(req, res, next) {
        try {
            const { bookCode, memberCode } = req.body
            if (!bookCode || !memberCode) {
                throw { name: "NULL_CODE" }
            }

            // Check if the member registered
            const checkMember = await Member.findOne({ where: { code: memberCode } })
            if (!checkMember) {
                throw { name: "MEMBER_NOT_FOUND" }
            }

            // Check if member is penelized
            if (checkMember.penalized) {
                const checkDuration = new Date() - checkMember.penalized
                if (checkDuration < 0) {
                    throw { name: "MEMBER_PENALIZED" }
                } else {
                    await Member.update(
                        { penalized: null },
                        {
                            where: {
                                code: memberCode
                            }
                        }
                    )
                }
            }

            // Check if the book registered
            const checkBook = await Book.findOne({ where: { code: bookCode } })
            if (!checkBook) {
                throw { name: "BOOK_NOT_FOUND" }
            }

            // Check if the book available to borrow
            if (checkBook.stock <= 0) {
                throw { name: "BOOK_UNAVAILABLE" }
            }

            // Check if the member has reach the borrow limit
            const checkBorrowedBook = await BookBorrow.findAll({
                where: { memberCode }
            })
            if (checkBorrowedBook.length >= 2) {
                throw { name: "BORROW_LIMIT_REACHED" }
            }

            const borrow = await BookBorrow.create({
                bookCode,
                memberCode
            })

            //decrease the stock in book
            await Book.update(
                { stock: checkBook.stock - 1 },
                {
                    where: {
                        code: bookCode
                    }
                }
            )

            res.status(201).json({ data: borrow })
        } catch (error) {
            next(error)
        }
    }

    static async returnBook(req, res, next) {
        try {
            const { memberCode, bookCode } = req.body
            if (!bookCode || !memberCode) {
                throw { name: "NULL_CODE" }
            }
            const bookBorrowed = await BookBorrow.findOne({
                where: {
                    memberCode,
                    bookCode
                }
            })

            // Check if the book borrowed by the member
            if (!bookBorrowed) {
                throw { name: "INVALID_MEMBER_BOOK" }
            }

            // Check if the borrowed book return is more than 7 days
            const deadline = (new Date() - bookBorrowed.createdAt) / (1000 * 60 * 60 * 24)
            let banned = false
            if (deadline >= 7) {
                banned = true
                const today = new Date()
                const duration = new Date(today)
                duration.setDate(today.getDate() + 3)
                await Member.update(
                    { penalized: duration },
                    {
                        where: {
                            code: memberCode
                        }
                    }
                )
            }

            // Update stock
            const book = await Book.findOne({ where: { code: bookCode } })
            await Book.update(
                { stock: book.stock + 1 },
                {
                    where: {
                        code: bookCode
                    }
                }
            )

            // Remove data from BookBorrow
            await BookBorrow.destroy({
                where: {
                    bookCode,
                    memberCode
                }
            })

            // message depends if the user missed the deadline
            let message
            if (banned) {
                message = "Book returned passed deadline, you have been penalized for 3 days"
            } else {
                message = "Book succecfully returend"
            }
            res.status(201).json({ data: message })
        } catch (error) {
            next(error)
        }
    }

    static async getBooks(req, res, next) {
        try {
            const books = await Book.findAll({
                where: {
                    stock: {
                        [Op.gt]: 0
                    }
                }
            })
            res.status(200).json({ data: books })
        } catch (error) {
            next(error)
        }
    }

    static async getMembers(req, res, next) {
        try {
            const members = await Member.findAll({
                attributes: [
                    'code',
                    'name',
                    'penalized',
                    [Sequelize.fn('COUNT', Sequelize.col('BookBorrows.id')), 'totalBook']
                ],
                include: [{
                    model: BookBorrow,
                    attributes: []
                }],
                group: ['Member.id']
            });

            res.status(200).json({ data: members })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller 