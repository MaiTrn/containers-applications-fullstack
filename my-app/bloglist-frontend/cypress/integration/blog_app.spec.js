Cypress.Commands.add("createUser", ({ name, username, password }) => {
  cy.request("POST", "http://localhost:3003/api/users", {
    name,
    username,
    password,
  });
});

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then((response) => {
    localStorage.setItem("loggedInBLogAppUser", JSON.stringify(response.body));
    cy.visit("http://localHost:3000");
  });
});

Cypress.Commands.add("createBlog", ({ title, author, url }) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3003/api/blogs",
    body: {
      title,
      author,
      url,
    },
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem("loggedInBLogAppUser")).token
      }`,
    },
  });
  cy.visit("http://localHost:3000");
});

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.createUser({ name: "Root user", username: "root", password: "sekret" });
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Username");
    cy.contains("Password");
    cy.contains("Login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("sekret");
      cy.get("#login-button").click();
      cy.contains("Root user is logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("notsekret");
      cy.get("#login-button").click();
      cy.get(".error")
        .should("contain", "Wrong user name or password")
        .and("have.css", "color", "rgb(255, 0, 0)");
      cy.get("html").should("not.contain", "Root user is logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "root", password: "sekret" });
    });

    it("A blog can be created", function () {
      cy.contains("Create new blog").click();
      cy.get("#title").type("Introduction to Cypress");
      cy.get("#author").type("Cypress");
      cy.get("#url").type(
        "https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Cypress-Can-Be-Simple-Sometimes"
      );
      cy.get("#add").click();
      cy.contains("Introduction to Cypress - Cypress");
    });
    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "Introduction to Cypress",
          author: "Cypress",
          url: "https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Cypress-Can-Be-Simple-Sometimes",
        });
      });

      it("Users can like a blog", function () {
        cy.contains("View").click();
        cy.contains("like").click();
        cy.contains("1");
      });
      it("User that created the blog can delete it", function () {
        cy.contains("View").click();
        cy.contains("Remove").click();
        cy.get("html").should(
          "not.contain",
          "Introduction to Cypress - Cypress"
        );
      });
    });

    describe("and many blogs exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "Introduction to Cypress",
          author: "Cypress",
          url: "https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Cypress-Can-Be-Simple-Sometimes",
        });
        cy.createBlog({
          title: "test blog",
          author: "tester",
          url: "https://test.com",
        });
        cy.createBlog({
          title: "test2 blog",
          author: "tester2",
          url: "https://test2.com",
        });
        cy.contains("Logout").click();
        cy.createUser({
          name: "Tester",
          username: "test",
          password: "testing",
        });
        cy.login({ username: "test", password: "testing" });
      });
      it("User that did not create the blog cannot delete it", function () {
        cy.contains("Introduction to Cypress - Cypress")
          .contains("View")
          .click();
        cy.get("html").should("not.contain", "Remove");
      });
      it.only("Blogs are ordered by likes DESC", function () {
        cy.contains("test blog - tester").contains("View").click();
        for (let i = 0; i < 5; i++) {
          cy.get(".info")
            .contains("https://test.com")
            .parent()
            .contains("like")
            .click();
          setTimeout(() => true, 2000);
        }
        cy.visit("http://localHost:3000");

        cy.get(".blog").then(($elements) => {
          let blogs = [...$elements].map((el) =>
            Number(el.childNodes[1].innerText.split("Likes ")[1].substr(0, 1))
          );
          let copy = [...blogs];
          cy.wrap(blogs).should(
            "deep.equal",
            copy.sort(function (a, b) {
              return b - a;
            })
          );
          //sorts the returned unsorted array with the returned sorted array
        });
      });
    });
  });
});
