import { PUT } from "./route";

describe("/api/items/cards/[id]", () => {
  it("인증 없는 요청 시 401 반환", async () => {
    const req = {
      json: async () => ({ title: "수정", rarity: "Common" }),
    } as any;
    const context = { params: { id: "testid" } };
    const res = await PUT(req, context);
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.message).toContain("로그인이 필요");
  });

  // 추가 테스트 케이스 작성 가능
});
