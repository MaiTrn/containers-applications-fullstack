db.createUser({
  user: "the_username",
  pwd: "the_password",
  roles: [
    {
      role: "dbOwner",
      db: "the_database",
    },
  ],
});

db.createCollection("users");
db.createCollection("blogs");

db.users.insert({
  name: "User Admin",
  username: "root",
  //pasword sekret
  passwordHash: "$2b$10$jVOyTW7NcbCpYrA7JrEG8.PQ77gsQ7bqq/ngUxvifhcNzcgtlD/LS",
});

db.blogs.insert({
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  likes: 29,
});

db.blogs.insert({
  title: "Type wars",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  likes: 3,
});
