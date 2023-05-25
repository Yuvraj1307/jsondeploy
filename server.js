const jsonserver = require("json-server");
const server = jsonserver.create();
const rout = jsonserver.router("./db.json");
const middlewares = jsonserver.defaults();
const db = require("./db.json");
const cors = require("cors");
let fs = require("fs");
const port = 4500;

server.use(cors({ origin: "*" }));
server.use(jsonserver.bodyParser);

server.get("/users", (req, res) => {
  let users = rout.db.get("users").value();
  res.json(users);
});
let count = 1;
function generateUniqueId() {
  return count++;
}
server.post("/users/rejister", (req, res) => {
  const { username, mail, password, doctor } = req.body;
  const data = req.body;
  let DB = rout.db;
  let users = DB.get("users").value();
  let newuser = { id: generateUniqueId(), username, mail, password, doctor };
  users.push(newuser);

  fs.writeFileSync("./db.json", JSON.stringify(DB));
  console.log(data);
  res.json({ users: "users" });
});
server.post("/users/login", (req, res) => {
  const { email, pass } = req.body;

  let DB = rout.db;
  let users = DB.get("users").value();
  let data = users.filter((el, i) => {
    return el.mail == email;
  });

  if (data[0].password == pass) {
    res.json({ login: "login success", isDoctor: data[0].doctor });
  } else {
    res.json({ msg: "login failed" });
    // console.log(data)
  }

  // res.json({users:"users"})
});

server.get("/appointments", (req, res) => {
  let users = rout.db.get("doctors").value();
  res.json(users);
});
let sec = 1;
function generateUniqueIdD() {
  return sec++;
}
server.post("/appointments/create", (req, res) => {
  let data = req.body;
  let DB = rout.db;
  let users = DB.get("doctors").value();
  let newuser = { id: generateUniqueIdD(), ...data };
  users.push(newuser);

  fs.writeFileSync("./db.json", JSON.stringify(DB));
  console.log(users);
  res.json({ mag: "appointments added" });
});

server.delete("/appointments/:id", (req, res) => {
  let id = req.params.id;
  let DB = rout.db;
  console.log(id);
  let users = DB.get("doctors").value();
//   let data = users.filter((el, i) => {
//     if (el.id == id) {
//       return el;
//     }
//   });
  let index;
  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      index = i;
    }
  }
  users.splice(index,1)
  fs.writeFileSync("./db.json", JSON.stringify(DB));
  console.log(index);
  res.json({ mag: "msg" });
});
server.use(middlewares);
server.use(rout);
server.listen(port, () => {
  console.log("server is running at 4500");
});
