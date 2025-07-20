import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../Header";

describe("Header", () => {
  it("로고와 네비게이션이 정상적으로 렌더링된다", () => {
    render(<Header />);
    expect(screen.getByText(/Aizen/)).toBeInTheDocument();
    expect(screen.getByText(/카드 갤러리/)).toBeInTheDocument();
  });
  it("로그인, 회원가입 버튼이 보인다", () => {
    render(<Header />);
    expect(screen.getByText(/로그인/)).toBeInTheDocument();
    expect(screen.getByText(/회원가입/)).toBeInTheDocument();
  });
});
