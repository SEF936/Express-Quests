const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const database = require("./database");

const getMovies = (req, res) => {
  const initialSql = "SELECT * FROM movies";
  const where = [];

  if (req.query.color != null) {
   where.push({
    column: "color",
    value: req.query.color,
    operator: "=",
   });
  }

  if (req.query.max_duration != null) {
    where.push({
      column: "duration",
      value: req.query.max_duration,
      operator: "<=",
     });
  }

  database
    .query(
      where.reduce(
      (sql, { column , operator }, index) =>
      `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`, initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};


const getMovieById = (req, res) => {

    const id = parseInt(req.params.id);
  
    database
      .query("select * from movies where id = ?", [id])
      .then(([movies]) => {
        if (movies[0] != null) {
          res.json(movies[0]);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };


  const getUsers = (req, res) => {

    const initialSql = "SELECT * FROM users";
    const where = [];
  
    if (req.query.language != null) {
     where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
     });
    }
  
    if (req.query.city != null) {
      where.push({
        column: "city",
        value: req.query.city,
        operator: "=",
       });
    }
  
    database
    .query(
      where.reduce(
      (sql, { column , operator }, index) =>
      `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`, initialSql
      ),
      where.map(({ value }) => value)
    )
      .then(([users]) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };
  const getUserById = (req, res) => {

    const id = parseInt(req.params.id);
  
    database
      .query("select * from users where id = ?", [id])
      .then(([users]) => {
        if (users[0] != null) {
          res.status(200).json(users[0]);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  const postMovie = (req,res) => {
    const { title, director, year, color, duration } = req.body;

    database.query(
      "INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    })
  };

  
  const postUser = (req,res) => {
    const { firstname, lastname, email, city, language } = req.body;

    database.query(
      "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    })
  };

  const updateMovie = (req,res) => {
    const id = parseInt(req.params.id);
    const { title, director, year, color, duration } = req.body;

    database.query(
      "update movies SET title=?, director=?, year=?, color=?, duration=? WHERE id=?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      result.affectedRows === 0 ? res.status(404).send("Not Found"): res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    })
  };

  const updateUser = (req,res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;

    database.query(
      "update users SET firstname=?, lastname=?, email=?, city=?, language=? WHERE id=?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      result.affectedRows === 0 ? res.status(404).send("Not Found"): res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the user");
    })
  };

  const deleteMovie = (req,res) => {
    const id = parseInt(req.params.id);
 
    database.query(
      "DELETE FROM movies WHERE id = ?", [id]
    )
    .then(([result]) => {
      result.affectedRows === 0 ? res.status(404).send("Not Found") : res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the movie");
    });
  };


  const deleteUser = (req,res) => {
    const id = parseInt(req.params.id);
 
    database.query(
      "DELETE FROM users WHERE id = ?", [id]
    )
    .then(([result]) => {
      result.affectedRows === 0 ? res.status(404).send("Not Found") : res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the users");
    });
  };




module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUserById,
  postMovie,
  postUser,
  updateMovie,
  updateUser,
  deleteMovie,
  deleteUser,
};
