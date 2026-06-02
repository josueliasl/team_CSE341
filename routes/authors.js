const express = require("express");
const router = express.Router();

const authorsController = require("../controllers/authors");

router.get("/", authorsController.getAllAuthors);

router.get("/:id", authorsController.getAuthorById);

router.post("/", authorsController.createAuthor);
/* #swagger.tags = ['Authors']
   #swagger.description = 'Create a new author'
   #swagger.parameters.body = {
       in: 'body',
       required: true,
       schema: {
           $name: 'J.R.R. Tolkien',
           $biography: 'Author of The Hobbit',
           $nationality: 'British'
       }
   }
*/

router.put("/:id", authorsController.updateAuthor);
/* #swagger.tags = ['Authors']
   #swagger.parameters.id = {
       in: 'path',
       required: true,
       type: 'string'
   }
   #swagger.parameters.body = {
       in: 'body',
       required: true,
       schema: {
           $name: 'John Ronald Reuel Tolkien',
           $biography: 'English writer',
           $nationality: 'British'
       }
   }
*/

router.delete("/:id", authorsController.deleteAuthor);

module.exports = router;