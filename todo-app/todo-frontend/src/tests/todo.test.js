import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Todo from "../Todos/Todo";

describe("Render todo content", () => {
  const todo = {
    _id: 1,
    text: "Test the component before build",
    done: false,
  };
  const onClickComplete = jest.fn();
  const onClickDelete = jest.fn();
  let component;

  beforeEach(() => {
    component = render(
      <Todo
        todo={todo}
        onClickComplete={() => onClickComplete}
        onClickDelete={() => onClickDelete}
      />
    );
  });

  it("should render the correct todo text", () => {
    expect(
      component.getByText("Test the component before build")
    ).toBeVisible();
    expect(component.getByText("This todo is not done")).toBeVisible();
  });

  it("should call onClickComplete on click", () => {
    fireEvent.click(component.getByText("Set as done"));
    expect(onClickComplete).toHaveBeenCalledTimes(1);
  });

  it("should call onClickDelete on click", () => {
    fireEvent.click(component.getByText("Delete"));
    expect(onClickDelete).toHaveBeenCalledTimes(1);
  });
});
