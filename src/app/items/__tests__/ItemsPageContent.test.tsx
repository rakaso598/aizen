import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ItemsPageContent from "../ItemsPageContent";
// jest-dom 확장 타입 인식용 import (tsconfig, jest 환경에서 필요)
import "@testing-library/jest-dom";

// mock next/link
const MockLink = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => <a {...props}>{children}</a>;
MockLink.displayName = "MockLink";
jest.mock("next/link", () => MockLink);
// mock next/image
const MockImage = (props: any) => <img {...props} />;
MockImage.displayName = "MockImage";
jest.mock("next/image", () => MockImage);

describe("ItemsPageContent", () => {
  it("카드 갤러리 제목이 정상적으로 렌더링된다", () => {
    render(<ItemsPageContent />);
    expect(screen.getByText(/AI 아트 카드 갤러리/)).toBeInTheDocument();
  });

  it("필터 적용 버튼이 렌더링된다", () => {
    render(<ItemsPageContent />);
    expect(
      screen.getByRole("button", { name: /필터 적용/ })
    ).toBeInTheDocument();
  });

  it("로딩 중이면 스피너가 보인다", () => {
    // loading 상태를 강제로 true로 설정
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [[], jest.fn()])
      .mockImplementationOnce(() => [true, jest.fn()]);
    render(<ItemsPageContent />);
    expect(screen.getByText(/페이지를 로드하는 중입니다/)).toBeInTheDocument();
  });

  it("에러 메시지가 있으면 표시된다", () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [[], jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()])
      .mockImplementationOnce(() => ["에러 발생", jest.fn()]);
    render(<ItemsPageContent />);
    expect(screen.getByText(/에러 발생/)).toBeInTheDocument();
  });
});
