import { POST } from "./route";

describe("/api/trades", () => {
  it("인증 없는 요청 시 401 반환", async () => {
    const req = {
      json: async () => ({
        proposerCardId: "1",
        receiverId: "2",
        receiverCardId: "3",
      }),
    } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.message).toContain("로그인이 필요");
  });

  // 추가 테스트 케이스 작성 가능
});
