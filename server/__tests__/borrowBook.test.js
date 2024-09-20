const app = require("../app");
const request = require("supertest")
const { Book, BookBorrow, Member, sequelize } = require('../models/index')

let books = require('../data/books.json')
let members = require('../data/members.json')

