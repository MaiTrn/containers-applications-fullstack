import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";
import AddBlogForm from "./AddBlogForm";

describe("Blog component", () => {
  const mockHandler = jest.fn();
  let component;
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 0,
    id: "61a3a591b034143b46845da0",
    userId: {
      name: "tester",
      username: "testing",
    },
  };

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user="Mai" updateLike={mockHandler} />
    );
  });

  test("by default only the title and author are shown", () => {
    const header = component.container.querySelector(".header");
    expect(header).toHaveTextContent("React patterns - Michael Chan");
    const info = component.container.querySelector(".info");
    expect(info).toHaveStyle("display:none");
  });

  test("cliking the show button displays url and likes", () => {
    const button = component.getByText("View");
    fireEvent.click(button);

    const div = component.container.querySelector(".info");
    expect(div).not.toHaveStyle("display: none");
    expect(div).toHaveTextContent("https://reactpatterns.com/");
    expect(div).toHaveTextContent("0");
  });

  test("clicking the like button twice calls event handler twice", () => {
    const viewButton = component.getByText("View");
    fireEvent.click(viewButton);

    const button = component.getByText("like");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockHandler.mock.calls).toHaveLength(2);
    const div = component.container.querySelector(".info");
    expect(div).toHaveTextContent(2);
  });
});

describe("Add Blog Form component", () => {
  const mockHandler = jest.fn();
  let component;
  beforeEach(() => {
    component = render(<AddBlogForm createBlog={mockHandler} />);
  });

  test("the form updates the state and calls onSubmit", () => {
    const title = component.container.querySelector("#title");
    const author = component.container.querySelector("#author");
    const url = component.container.querySelector("#url");
    const form = component.container.querySelector("form");

    fireEvent.change(title, {
      target: { value: "React patterns" },
    });
    fireEvent.change(author, {
      target: { value: "Michael Chan" },
    });
    fireEvent.change(url, {
      target: {
        value: "https://reactpatterns.com/",
      },
    });
    fireEvent.submit(form);

    expect(mockHandler.mock.calls[0][0]).toEqual({
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    });
  });
});
