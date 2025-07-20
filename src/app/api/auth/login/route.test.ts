import { POST } from "./route";
import { NextResponse } from "next/server";

describe("/api/auth/login", () => {
  it("필수 필드 누락 시 400 반환", async () => {
    const req = {
      json: async () => ({ emailOrUsername: "", password: "" }),
      headers: { get: () => null },
    } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.message).toContain("이메일/사용자 이름과 비밀번호를 모두 입력");
  });

  // 실제 DB/mock DB 환경에 따라 추가 테스트 작성 가능
});
