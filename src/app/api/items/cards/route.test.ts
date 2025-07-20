import { GET } from "./route";

describe("/api/items/cards", () => {
  it("잘못된 페이지 번호 시 400 반환", async () => {
    const req = {
      url: "http://localhost/api/items/cards?page=abc",
    } as any;
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toContain("잘못된 페이지 번호");
  });

  // 추가 테스트 케이스 작성 가능
});
