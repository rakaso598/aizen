import { POST } from "./route";

describe("/api/auth/signup", () => {
  it("필수 필드 누락 시 400 반환", async () => {
    const req = {
      json: async () => ({ email: "", username: "", password: "" }),
    } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toContain("이메일, 사용자 이름, 비밀번호를 모두 입력");
  });

  // 추가 테스트 케이스 작성 가능
});
