    function errorHandler(err, req, res, next) {
        switch (err.name) {
            case "BOOK_NOT_FOUND":
                res.status(404).json({ message: "Book not registered" })
                break;
            case "MEMBER_NOT_FOUND":
                res.status(404).json({ message: "Member not registered" })
                break;
            case "NULL_CODE":
                res.status(422).json({ message: "Member and book code required" })
                break;
            case "BORROW_LIMIT_REACHED":
                res.status(403).json({ message: "Member has reach the limit of borrowed book" })
                break;
            case "BOOK_UNAVAILABLE":
                res.status(404).json({ message: "Book out of stock" })
                break;
            case "MEMBER_PENALIZED":
                res.status(401).json({ message: "Member is still penelized" })
                break;
            case "INVALID_MEMBER_BOOK":
                res.status(401).json({ message: "Member does not borrow the book" })
                break;
            default:
                console.log("error di server", err);
                res.status(500).json({ message: "Internal server error" })
                break;
        }
    }

    module.exports = errorHandler