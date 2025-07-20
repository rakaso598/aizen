import React from "react";
import { render, screen } from "@testing-library/react";
import CardDetailPage from "../page";
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

describe("CardDetailPage", () => {
  it("카드 상세 제목이 정상적으로 렌더링된다", () => {
    render(<CardDetailPage />);
    expect(screen.getByText(/특별한 아트/)).toBeInTheDocument();
  });
  // 실제 데이터 fetch/useState mocking이 필요할 수 있음
});
