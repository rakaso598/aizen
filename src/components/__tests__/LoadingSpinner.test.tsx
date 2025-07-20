import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";
import "@testing-library/jest-dom";

describe("LoadingSpinner", () => {
  it("로딩 스피너와 텍스트가 정상적으로 렌더링된다", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/페이지를 로드하는 중입니다/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
