import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("저작권 문구가 보인다", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 Aizen/)).toBeInTheDocument();
  });
  it("프로젝트 설명 문구가 보인다", () => {
    render(<Footer />);
    expect(
      screen.getByText(/AI 아트 카드 갤러리 및 거래 플랫폼/)
    ).toBeInTheDocument();
    expect(screen.getByText(/개발 단계의 프로젝트입니다/)).toBeInTheDocument();
  });
});
