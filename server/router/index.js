const express = require('express')
const Controller = require('../controllers/controller')
const errorHandler = require('../middleware/errorhandler')
const router = express.Router()

/**
 * @openapi
 * /borrowBook:
 *   post:
 *     tags:
 *       - BorrowBook
 *     summary: Borrow a book from the library
 *     description: Allows a member to borrow a book by providing their member code and the book code. The book's availability and the member's borrow limit are checked before the book is borrowed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookCode:
 *                 type: string
 *                 description: The code of the book to be borrowed
 *                 example: "HOB-83"
 *               memberCode:
 *                 type: string
 *                 description: The member's unique code
 *                 example: "M001"
 *     responses:
 *       201:
 *         description: Book successfully borrowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookCode:
 *                       type: string
 *                     memberCode:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Book or member not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not registered"
 *       422:
 *         description: Book or member code missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member and book code required"
 *       403:
 *         description: Borrow limit reached
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member has reached the limit of borrowed books"
 *       401:
 *         description: Member is penalized or member does not borrow the book
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                   required:
 *                     - message
 *                   example:
 *                     message: "Member is still penalized"
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                   required:
 *                     - message
 *                   example:
 *                     message: "Member did not borrow this book"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/borrowBook", Controller.borrowBook)

/**
 * @openapi
 * /returnBook:
 *   post:
 *     tags:
 *       - ReturnBook
 *     summary: Return a borrowed book to the library
 *     description: Allows a member to return a borrowed book. Checks if the book was borrowed by the member and if the return is overdue. Updates the book stock and removes the borrow record. Penalizes the member if the book was returned late.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookCode:
 *                 type: string
 *                 description: The code of the book being returned
 *                 example: "HOB-83"
 *               memberCode:
 *                 type: string
 *                 description: The member's unique code
 *                 example: "M001"
 *     responses:
 *       201:
 *         description: Book successfully returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "Book successfully returned"
 *       400:
 *         description: Invalid request, missing book code or member code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member and book code required"
 *       404:
 *         description: Book or member not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found or not borrowed by member"
 *       403:
 *         description: Book return is overdue and member is penalized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "Book returned past deadline, you have been penalized for 3 days"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/returnBook", Controller.returnBook)

/**
 * @openapi
 * /getBooks:
 *   get:
 *     tags:
 *       - GetBook
 *     summary: Retrieve a list of available books
 *     description: Fetches all books that are currently in stock (i.e., with stock greater than 0).
 *     responses:
 *       200:
 *         description: Successfully retrieved list of books thats available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         description: The unique code of the book
 *                         example: "HOB-83"
 *                       title:
 *                         type: string
 *                         description: The title of the book
 *                         example: "The Hobbit, or There and Back Again"
 *                       author:
 *                         type: string
 *                         description: The author of the book
 *                         example: "J.R.R. Tolkien"
 *                       stock:
 *                         type: integer
 *                         description: The number of copies of the book available in stock
 *                         example: 1
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/getBooks", Controller.getBooks)

/**
 * @openapi
 * /getMembers:
 *   get:
 *     tags:
 *       - GetMember
 *     summary: Retrieve a list of members with their total borrowed books
 *     description: Fetches all members with their unique code, name, penalization status, and the total number of books they have borrowed.
 *     responses:
 *       200:
 *         description: Successfully retrieved list of members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         description: The unique code of the member
 *                         example: "M001"
 *                       name:
 *                         type: string
 *                         description: The name of the member
 *                         example: "Angga"
 *                       penalized:
 *                         type: string
 *                         format: date
 *                         description: The date until which the member is penalized, if applicable
 *                         example: "2024-09-20T04:39:30.000Z"
 *                       totalBook:
 *                         type: integer
 *                         description: The total number of books the member has borrowed
 *                         example: 1
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/getMembers", Controller.getMembers)

router.use(errorHandler)
module.exports = router