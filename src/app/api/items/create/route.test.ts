import { POST } from "./route";

describe("/api/items/create", () => {
  it("인증 없는 요청 시 401 반환", async () => {
    // getServerSession이 undefined를 반환하도록 mock 필요 (실제 환경에 맞게 조정)
    const req = {
      json: async () => ({
        title: "카드",
        imageUrl: "http://test.com/img.png",
        rarity: "Common",
      }),
    } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.message).toContain("인증되지 않은 사용자");
  });

  // 추가 테스트 케이스 작성 가능
});
