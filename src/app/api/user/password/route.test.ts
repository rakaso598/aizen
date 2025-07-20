import { PUT } from "./route";

describe("/api/user/password", () => {
  it("인증 없는 요청 시 401 반환", async () => {
    const req = {
      headers: { get: () => null },
      json: async () => ({ currentPassword: "old", newPassword: "newpass" }),
    } as any;
    const res = await PUT(req);
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.message).toContain("토큰이 제공되지 않았습니다");
  });

  // 추가 테스트 케이스 작성 가능
});
