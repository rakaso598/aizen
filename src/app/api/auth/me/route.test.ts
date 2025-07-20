import { GET } from "./route";

describe("/api/auth/me", () => {
  it("Authorization 헤더 없으면 401 반환", async () => {
    const req = {
      headers: { get: () => null },
    } as any;
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.message).toContain("토큰이 제공되지 않았습니다");
  });

  // 토큰이 유효하지 않을 때, 정상일 때 등 추가 테스트 가능
});
