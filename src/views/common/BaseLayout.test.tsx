import { render, screen } from "@testing-library/react";
import React from "react";
import TestsWrapper from "../../utils/testing/TestsWrapper";
import BaseLayout from "./BaseLayout";

jest.mock("../../context/UserContextProvider", () => {
  // eslint-disable-next-line
  const testUserContext = require("../../utils/testing/TestUserContextProvider");
  return {
    UserContext: testUserContext.TestUserContext,
  };
});

test("renders topbar with logo", () => {
  render(
    <TestsWrapper>
      <BaseLayout menuEntries={[]}>
        <>some</>
      </BaseLayout>
    </TestsWrapper>
  );
  const logoText = screen.getByText(/ToptalEats/i);
  expect(logoText).toBeInTheDocument();
});
