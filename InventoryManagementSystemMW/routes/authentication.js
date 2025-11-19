var express = require('express');
var bcrypt = require('bcrypt');
const router = express.Router();
var Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
require('dotenv').config();

var knex = require("knex")({
  client: 'mssql',
  connection: {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    port: parseInt(process.env.APP_SERVER_PORT),
    options: {
      enableArithAbort: true,

    }
  },
});

var db = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.SERVER,
  dialect: "mssql",
  port: parseInt(process.env.APP_SERVER_PORT),
});

const Users = db.define('users_master', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_name: {
    type: DataTypes.STRING
  },
  first_name: {
    type: DataTypes.STRING
  },
  last_name: {
    type: DataTypes.STRING
  },
  pass_word: {
    type: DataTypes.STRING
  },
  user_email: {
    type: DataTypes.STRING
  },
  user_role: {
    type: DataTypes.STRING
  },
  user_tier: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.STRING
  },
  created_at: {
    type: DataTypes.STRING
  },
  created_by: {
    type: DataTypes.STRING
  },
  updated_at: {
    type: DataTypes.STRING
  },
  updated_by: {
    type: DataTypes.STRING
  },
}, {
  freezeTableName: false,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  tableName: 'users_master'
})

//Login Function
router.get('/login', async function (req, res, next) {
  try {
    const user = await Users.findAll({
      where: {
        user_name: req.query.user_name
      }
    });
    console.log(req.query)
    console.log(user[0])

    if (!user || user.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.query.pass_word !== user[0].pass_word) {

      return res.status(401).json({ msg: 'Incorrect password' });

    }

    console.log("The username: ", user[0].user_name);
    console.log("Name: ", user[0].first_name + ' ' + user[0].last_name);
    console.log("Password: ", user[0].pass_word);
    console.log("Email: ", user[0].user_email);
    console.log("Role: ", user[0].user_role);
    console.log("Tier: ", user[0].user_tier);

    res.json(user[0]);
  } catch (err) {
    console.error("Error during login GET:", err);

  }
});

router.post('/register', async function (req, res, next) {

  const currentTimestamp = new Date(); //Current time - YYYY/MM/DD - 00/HH/MM/SSS

  console.log(req)
  const {
    first_name,
    last_name,
    user_name,
    user_email,
    user_role,
    user_tier,
    pass_word,
    created_by,
  } = req.body;

  // const currentUserData = await knex('users_master').where({ id_master: currentUserId }).first();
  // console.log('CURRENT USER DATA:', currentUserData)

  // try {
  //   const [user] = await knex('users_master').insert({
  //     first_name: first_name,
  //     last_name: last_name,
  //     user_name: user_name,
  //     user_email: user_email,
  //     user_role: user_role,
  //     user_tier: user_tier,
  //     pass_word: pass_word,
  //     created_at: new Date(),
  //     created_by: created_by,
  //     is_active: true

  //   }).returning('id_master')

  //   const id_master = user.id_master || user;

  //   const currentUserPosition = currentUserData.emp_position

  //   if (currentUserPosition === 'super-admin') {
  //     await knex('users_logs').insert({
  //       user_id: id_master,
  //       emp_firstname: emp_firstname,
  //       emp_lastname: emp_lastname,
  //       updated_by: updated_by,
  //       time_date: currentTimestamp,
  //       changes_made: 'Super-admin: ' + first_name + ' ' + last_name + ' registered ' + user_name + ', Role: ' + emp_role + ', Position: ' + emp_position
  //     })
  //   } else {
  //     await knex('users_logs').insert({
  //       user_id: id_master,
  //       emp_firstname: emp_firstname,
  //       emp_lastname: emp_lastname,
  //       updated_by: updated_by,
  //       time_date: currentTimestamp,
  //       changes_made: 'Admin: ' + first_name + ' ' + last_name + ' registered ' + user_name + ', Role: ' + emp_role + ', Position: ' + emp_position
  //     })
  //   }
  try {
    await knex('users_master').insert({
      first_name: first_name,
      last_name: last_name,
      user_name: user_name,
      user_email: user_email,
      user_role: user_role,
      user_tier: user_tier,
      pass_word: pass_word,
      created_at: new Date(),
      created_by: created_by,
      is_active: true

    })

    console.log('User registered');
    res.status(200).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Registration error:", err); // show actual error
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

//User Checker
router.get('/user-checker', async function (req, res) {
  try {
    const { user_name, user_email } = req.query;

    const checkUserName = await Users.findOne({
      where: { user_name }
    });

    const checkEmail = await Users.findOne({
      where: { user_email }
    });

    return res.json({
      usernameExists: !!checkUserName,
      emailExists: !!checkEmail
    });

  } catch (err) {
    console.log('INTERNAL ERROR: ', err);
    res.status(500).json({ error: 'Server error' });
  }
});


//Get all users
router.get('/users', async function (req, res, next) {
  const result = await knex.select('*').from('users_master');
  res.json(result);
  console.log(result);
});

//Get User by id
router.get('/useredit', async (req, res, next) => {
  try {
    const getUser = await Users.findAll({
      where: {
        id_master: req.query.id
      }
    })
    console.log(getUser)
    res.json(getUser[0]);


  } catch (err) {
    console.error('Error fetching user data', err);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
})

//Get all Users logs
router.get('/logs', async (req, res) => {
  const { start, end } = req.query;

  try {
    let query = knex('users_logs').select('*');

    if (start && end) {
      query = query.whereBetween('time_date', [start, end]);
    }

    const logs = await query.orderBy('time_date', 'desc');
    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

//Delete a request by id
router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  const updatedBy = req.query.updated_by; // ✅ FIXED

  try {
    const user = await knex('users_master').where('id_master', id).first();
    console.log('USER DATA', user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await knex('users_logs').insert({
      user_id: user.id_master,
      emp_firstname: user.emp_firstname,
      emp_lastname: user.emp_lastname,
      updated_by: updatedBy,
      changes_made: `${user.user_name} permanently deleted by ${updatedBy}`,
      time_date: new Date()
    })

    await knex('users_master').where('id_master', id).del();

    res.status(200).json({ message: 'User logged and deleted successfully' });
  } catch (error) {
    console.error('Error logging and deleting user:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//activating a user
router.post('/isactivechecker', async (req, res) => {
  try {
    const {
      id_master,
      is_active
    } = req.body

    await knex('users_master').where({ id_master: id_master }).update({
      is_active: is_active
    })
  } catch (err) {

  }
})

router.post('/isactivelogout', async (req, res) => {
  try {
    const {
      id_master,
      is_active
    } = req.body

    await knex('users_master').where({ id_master: id_master }).update({
      is_active: is_active
    })
  } catch (err) {

  }
})







module.exports = router;