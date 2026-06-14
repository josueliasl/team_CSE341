const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authenticate");

const usersController = require("../controllers/users");

// Debug middleware for users routes
router.use((req, res, next) => {
  console.log(`📌 Users route - ${req.method} ${req.path} - Auth: ${req.isAuthenticated?.()}`);
  next();
});

router.get("/", usersController.getAllUsers);

router.get("/:id", usersController.getUserById);

router.post("/", isAuthenticated, usersController.createUser);
/* #swagger.tags = ['Users']
   #swagger.description = 'Create a new user'
   #swagger.parameters.body = {
       in: 'body',
       required: true,
       schema: {
           $firstName: 'John',
           $lastName: 'Doe',
           $email: 'john@example.com',
           $age: 25,
           $role: 'member',
           $isActive: true,
           $createdAt: '2024-01-01'
       }
   }
*/

router.put("/:id", usersController.updateUser);
/* #swagger.tags = ['Users']
   #swagger.description = 'Update an existing user'
   #swagger.parameters.id = {
       in: 'path',
       required: true,
       type: 'string'
   }
   #swagger.parameters.body = {
       in: 'body',
       required: true,
       schema: {
           $firstName: 'Updated',
           $lastName: 'User',
           $email: 'updated@example.com',
           $age: 30,
           $role: 'admin',
           $isActive: true,
           $createdAt: '2024-01-01'
       }
   }
*/

router.delete("/:id", isAuthenticated, usersController.deleteUser);

module.exports = router;