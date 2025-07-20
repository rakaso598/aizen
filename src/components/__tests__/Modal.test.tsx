import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../Modal";
import "@testing-library/jest-dom";

describe("Modal", () => {
  it("open이 false면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(
      <Modal open={false} onClose={jest.fn()}>
        내용
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("open이 true면 children과 닫기 버튼이 보인다", () => {
    render(
      <Modal open={true} onClose={jest.fn()} title="타이틀">
        모달 내용
      </Modal>
    );
    expect(screen.getByText("타이틀")).toBeInTheDocument();
    expect(screen.getByText("모달 내용")).toBeInTheDocument();
    expect(screen.getByLabelText("닫기")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose가 호출된다", () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} onClose={onClose} title="타이틀">
        모달 내용
      </Modal>
    );
    fireEvent.click(screen.getByLabelText("닫기"));
    expect(onClose).toHaveBeenCalled();
  });
});
