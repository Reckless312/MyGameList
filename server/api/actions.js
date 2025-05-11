const {Router} = require("express");
const {createUser, getUserByName, updateUser} = require("../sequalize/users")

const router = Router();

router.route('/')
    .post(async (req, res) => {
        try {
            if (req.body === undefined || req.body?.name === undefined) {
                return res.status(404).json({ message: 'Missing required fields' });
            }

            const { name, email, image } = req.body;
            await createUser(name, email, image, "User");

            res.status(200).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error happened while adding a new user' });
        }
    })
    .patch(async (req, res) => {
        try {
            if (req.body === undefined || req.body?.id === undefined || req.body?.name === undefined || req.body?.email === undefined || req.body?.image === undefined || req.body?.role === undefined) {
                return res.status(404).json({ message: 'Missing required fields' });
            }

            const { id, name, email, image, role } = req.body;
            await updateUser(id, name, email, image, role);

            res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error happened while adding a new user' });
        }
    })

router.route('/name')
    .post(async (req, res) => {
        try {
            if (req.body === undefined || req.body?.name === undefined) {
                return res.status(404).json({ message: 'Missing required fields' });
            }

            const { name } = req.body;

            const response = await getUserByName(name);
            res.json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error happened while adding a new user' });
        }
    })

module.exports = router;