const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const expressSwagger = require("express-swagger-generator")(app);

let options = {
  swaggerDefinition: {
      info: {
          description: 'Baza danych dziennika elektronicznego',
          title: 'PAI projekt',
          version: '1.0.0',
      },
      host: 'localhost:8080',
      produces: [
          "application/json"
      ],
      schemes: ['http']
  },
  basedir: "D:/PAI/_projekt/baza", //app absolute path
  files: ['./*.js']
};
expressSwagger(options);

const db = require("./models/index");
const { sequelize, Sequelize } = require("./models/index");

const _DEVELOPER_MODE = false; //usunie uzytkownikow

if (!_DEVELOPER_MODE)
    db.sequelize.sync();
else{
    db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
}

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


// ROUTES //

/**
 * This function comment is parsed by doctrine
 * @route POST /api/login
 * @param {string} login.query.required - username
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - Informacje o użytkowniku
 */
app.post("/api/login", (request, response) => {
  let login = request.body.login;
  let password = request.body.password;
  
  db.uzytkownicy.findOne({ where: {
    login: login,
    password: password
  }}).then(result => {
    let output = {};

    output['status'] = result ? true : false;
    output['user_id'] = result.id;
    output['teacher'] = result.teacher;
    output['name'] = result.full_name;

    response.send(output);
  });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /api/subject_name/:student/:id
 * @param {number} student.params.required - ID ucznia
 * @param {number} id.params.required - ID przedmiotu
 * @returns {object} 200 - Informacje o uczniu i przedmiocie
 */
app.get("/api/subject_name/:student/:id", async (request, response) => {
  let id = request.params.id;
  let student_id = request.params.student;

  const subject = await db.przedmioty.findOne({where: {id: id}});
  const student = await db.uzytkownicy.findOne({where: {id: student_id}});

  let output = {};

  output['subject'] = subject.name;
  output['student'] = student.full_name;

  response.send(output);
});

/**
 * This function comment is parsed by doctrine
 * @group Kategorie ocen
 * @route GET /api/category
 * @returns {object} 200 - Informacje o kategoriach ocen
 */
app.get("/api/category", async (request, response) => {
  const data = await db.kategorie.findAll();

  response.send(data);
});

/**
 * This function comment is parsed by doctrine
 * @group Przedmioty
 * @route GET /api/subject/:id
 * @param {number} id.params.required - ID przedmiotu
 * @returns {object} 200 - Informacje o wybranym przedmiocie
 */
app.get("/api/subject/:id", async (request, response) => {
  let id = request.params.id;

  const data = await db.przedmioty.findOne({where: {id: id}});

  response.send(data.name);
});

/**
 * This function comment is parsed by doctrine
 * @group Przedmioty
 * @route GET /api/subject
 * @returns {object} 200 - Informacje o przedmiotach
 */
app.get("/api/subject", async (request, response) => {
  const data = await db.przedmioty.findAll();

  response.send(data);
});

/**
 * This function comment is parsed by doctrine
 * @group Użytkownicy
 * @route GET /api/users
 * @returns {object} 200 - Informacje o użytkownikach
 */
app.get("/api/users", async (request, response) => {
  const data = await db.uzytkownicy.findAll({attributes: ['id','login','full_name','teacher']});

  response.send(data);
});

/**
 * This function comment is parsed by doctrine
 * @group Oceny
 * @route GET /api/notes/:id/:teacher
 * @param {number} id.params.required - Jeśli parametr teacher = 1, to ID przedmiotu w przeciwnym razie ID ucznia
 * @param {number} teacher.params.required - Czy nauczyciel
 * @returns {object} 200 - Informacje o ocenach ucznia/w przedmiocie
 */
app.get("/api/notes/:id/:teacher", async (request, response) => {
  let id = request.params.id;
  let isTeacher = request.params.teacher == 1;
  let output = [];

  let query;

  if (isTeacher)
  query = await db.uzytkownicy.findAll({where: {teacher: false}});
  else
  query = await db.przedmioty.findAll();

  for (let i = 0; i < query.length; i++){
    let data = {
      id: query[i].id,
      name: isTeacher ? query[i].full_name : query[i].name,
      notes: []
    };
    let tmpNotes;

    if (isTeacher)
    tmpNotes = await db.oceny.findAll({where: {user_id: query[i].id, subject_id: id}});
    else
    tmpNotes = await db.oceny.findAll({where: {subject_id: query[i].id, user_id: id}});
    
    let sum = 0;
    let number = 0;

    for (let x = 0; x < tmpNotes.length; x++){
      let note = tmpNotes[x];
      let noteValue = note.value;
      let noteArray = {};

      const category_data = await db.kategorie.findOne({where :{id: note.category_id}});

      if (['1+','2+','3+','4+','5+'].includes(note.value)){
        noteValue = (Number(noteValue.charAt(0)) + 0.5) * category_data.weight;
        number += category_data.weight;
      }
      else if (['2-','3-','4-','5-','6-'].includes(note.value)){
        noteValue = (Number(noteValue.charAt(0)) - 0.25) * category_data.weight;
        number += category_data.weight;
      }
      else if (['+','-','np','bz'].includes(note.value))
        noteValue = 0;      
      else{
        noteValue = Number(noteValue) * category_data.weight;
        number += category_data.weight;
      }

      noteArray.id = note.id;
      noteArray.value = note.value;
      noteArray.weight = category_data.weight;
      noteArray.color = category_data.color;

      data.notes.push(noteArray);
      sum += noteValue;
    }
    data.avg = number > 0 ? (sum / number).toFixed(2) : '-'; 

    output.push(data);
  }
  
  response.send(output);
});

/**
 * This function comment is parsed by doctrine
 * @group Użytkownicy
 * @route POST /api/users
 * @param {string} name.query.required - Imię i nazwisko
 * @param {string} login.query.required - Login
 * @param {string} password.query.required - Hasło
 * @param {string} teacher.query.required - Czy jest nauczycielem
 * @returns {object} 200 - Tworzy użytkownika
 */
app.post("/api/users", (request, response) => {
  let name = request.body.name;
  let login = request.body.login;
  let password = request.body.password;
  let teacher = request.body.teacher == "TAK";

  db.uzytkownicy.count({where: {login: login}}).then(count => {
    if (count == 0){
      db.uzytkownicy.create({
        full_name: name,
        login: login,
        password: password,
        teacher: teacher
      }).then(() => {
        response.send({status: true})
      });
    } else
    response.send({error: "Użytkownik z podanym loginem już istnieje", status: false});
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Oceny
 * @route GET /api/note/:id
 * @param {number} id.params.required - ID oceny
 * @returns {object} 200 - Szczegóły wybranej oceny
 */
app.get("/api/note/:id", async (request, response) => {
  let id = request.params.id;

  const data = await db.oceny.findOne({where: {id: id}});

  response.send(data);
});


/**
 * This function comment is parsed by doctrine
 * @group Oceny
 * @route PUT /api/note/:id
 * @param {number} id.params.required - ID oceny
 * @param {string} value.query.required - Wartość oceny
 * @param {number} category_id.query.required - ID kategorii
 * @param {string} comment.query.required - Komentarz
 * @returns {object} 200 - Aktualizuje ocenę
 */
app.put("/api/note/:id", (request, response) => {
  let id = request.params.id;
  let value = request.body.value;
  let category_id = request.body.category_id;
  let comment = request.body.comment;

  db.oceny.update({
    value: value,
    category_id: category_id,
    title: comment
  },{where: {id: id}}).then(() => {
    response.send({status: true})
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Oceny
 * @route DELETE /api/note/:id
 * @param {number} id.params.required - ID oceny
 * @returns {object} 200 - Usuwa ocenę
 */
app.delete("/api/note/:id", (request, response) => {
  let id = request.params.id;

  db.oceny.destroy({where: {id: id}}).then(() => {
    response.send({status: true})
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Użytkownicy
 * @route GET /api/users/:id
 * @param {number} id.params.required - ID użytkownika
 * @returns {object} 200 - Szczegóły wybranego użytkownika
 */
app.get("/api/users/:id", async (request, response) => {
  let id = request.params.id;

  const data = await db.uzytkownicy.findOne({where: {id: id}});

  response.send(data);
});

/**
 * This function comment is parsed by doctrine
 * @group Użytkownicy
 * @route PUT /api/users/:id
 * @param {number} id.params.required - ID użytkownika
 * @param {string} name.query.required - Imię i nazwisko
 * @param {string} login.query.required - Login
 * @param {string} password.query.required - Hasło
 * @param {string} teacher.query.required - Czy jest nauczycielem
 * @returns {object} 200 - Aktualizuje wybranego użytkownika
 */
app.put("/api/users/:id", (request, response) => {
  let id = request.params.id;
  let name = request.body.name;
  let login = request.body.login;
  let password = request.body.password;
  let teacher = request.body.teacher == "TAK";

  const Op = Sequelize.Op;

  db.uzytkownicy.count({where: {login: login, id: {[Op.not]: id}}}).then(count => {
    if (count == 0){
      db.uzytkownicy.update({
        full_name: name,
        login: login,
        password: password,
        teacher: teacher
      },{where: {id: id}}).then(() => {
        response.send({status: true})
      });
    } else
    response.send({error: "Użytkownik z podanym loginem już istnieje", status: false});
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Użytkownicy
 * @route DELETE /api/users/:id
 * @param {number} id.params.required - ID użytkownika
 * @returns {object} 200 - Usuwa wybranego użytkownika
 */
app.delete("/api/users/:id", (request, response) => {
  let id = request.params.id;

  db.uzytkownicy.destroy({where: {id: id}}).then(() => {
    response.send({status: true})
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Przedmioty
 * @route POST /api/subject
 * @param {string} name.query.required - Nazwa przedmiotu
 * @returns {object} 200 - Tworzy nowy przedmiot
 */
app.post("/api/subject", (request, response) => {
  let name = request.body.name;

  db.przedmioty.count({where: {name: name}}).then(count => {
    if (count == 0){
      db.przedmioty.create({
        name: name
      }).then(() => {
        response.send({status: true})
      });
    } else
    response.send({error: "Taki przedmiot już istnieje", status: false});
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Przedmioty
 * @route PUT /api/subject/:id
 * @param {number} id.params.required - ID przedmiotu
 * @param {string} name.query.required - Nazwa przedmiotu
 * @returns {object} 200 - Aktualizuje przedmiot
 */
app.put("/api/subject/:id", (request, response) => {
  let id = request.params.id;
  let name = request.body.name;

  db.przedmioty.count({where: {name: name}}).then(count => {
    if (count == 0){
      db.przedmioty.update({
        name: name
      },{where: {id: id}}).then(() => {
        response.send({status: true})
      });
    } else
    response.send({error: "Taki przedmiot już istnieje", status: false});
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Przedmioty
 * @route DELETE /api/subject/:id
 * @param {number} id.params.required - ID przedmiotu
 * @returns {object} 200 - Usuwa przedmiot
 */
app.delete("/api/subject/:id", (request, response) => {
  let id = request.params.id;

  db.przedmioty.destroy({where: {id: id}}).then(() => {
    response.send({status: true})
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Kategorie ocen
 * @route POST /api/category
 * @param {number} id.query.required - ID kategorii
 * @param {string} name.query.required - Nazwa kategorii
 * @param {number} weight.query.required - Waga oceny
 * @param {string} color.query.required - Kolor w HEX
 * @returns {object} 200 - Tworzy nową kategorię ocen
 */
app.post("/api/category", (request, response) => {
  let name = request.body.name;
  let weight = request.body.weight;
  let color = request.body.color;

  db.kategorie.count({where: {name: name}}).then(count => {
    if (count == 0){
      db.kategorie.create({
        name: name,
        weight: weight,
        color: color
      }).then(() => {
        response.send({status: true})
      });
    } else
    response.send({error: "Taka kategoria już istnieje", status: false});
  });
});

/**
 * This function comment is parsed by doctrine
 * @group Kategorie ocen
 * @route GET /api/category/:id
 * @param {number} id.params.required - ID kategorii
 * @returns {object} 200 - Zwraca szczegóły wybranej kategorii
 */
app.get("/api/category/:id", async (request, response) => {
  let id = request.params.id;

  const data = await db.kategorie.findOne({where: {id: id}});

  response.send(data);
});

/**
 * This function comment is parsed by doctrine
 * @group Kategorie ocen
 * @route PUT /api/category/:id
 * @param {number} id.params.required - ID kategorii
 * @param {string} name.query.required - Nazwa kategorii
 * @param {number} weight.query.required - Waga oceny
 * @param {string} color.query.required - Kolor w HEX
 * @returns {object} 200 - Aktualizuje kategorię ocen
 */
app.put("/api/category/:id", (request, response) => {
  let id = request.params.id;
  let name = request.body.name;
  let weight = request.body.weight;
  let color = request.body.color;

  db.kategorie.count({where: {name: name}}).then(count => {
    if (count == 0){
      db.kategorie.update({
        name: name,
        weight: weight,
        color: color
      },{where: {id: id}}).then(() => {
        response.send({status: true})
      });
    } else
    response.send({error: "Taka kategoria już istnieje", status: false});
  });
});


/**
 * This function comment is parsed by doctrine
 * @group Kategorie ocen
 * @route DELETE /api/category/:id
 * @param {number} id.params.required - ID kategorii
 * @returns {object} 200 - Usuwa kategorię ocen
 */
app.delete("/api/category/:id", (request, response) => {
  let id = request.params.id;

  db.kategorie.destroy({where: {id: id}}).then(() => {
    response.send({status: true})
  });
});


/**
 * This function comment is parsed by doctrine
 * @group Oceny
 * @route POST /api/note
 * @param {string} note.query.required - Wartość oceny
 * @param {number} category.query.required - ID kategorii
 * @param {number} subject_id.query.required - ID przedmiotu
 * @param {number} student_id.query.required - ID ucznia
 * @param {string} comment.query.required - Komentarz
 * @returns {object} 200 - Tworzy nową ocenę
 */
app.post("/api/note", (request, response) => {
  let note = request.body.note;
  let category = request.body.category;
  let subject_id = request.body.subject_id;
  let student_id = request.body.student_id;
  let comment = request.body.comment;

  db.oceny.create({
    value: note,
    category_id: category,
    subject_id: subject_id,
    user_id: student_id,
    title: comment
  }).then(() => {
    response.send({status: true})
  });
});