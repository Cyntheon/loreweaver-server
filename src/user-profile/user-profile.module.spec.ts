import {forwardRef} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";
import {UserProfileResolver} from "./user-profile.resolver";
import {UserProfileService} from "./user-profile.service";

describe("UserProfileModule", () => {
  it("should compile with all providers and imports", async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule]
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(UserProfileService)).toBeInstanceOf(UserProfileService);
    expect(module.get(UserProfileResolver)).toBeInstanceOf(UserProfileResolver);
    expect(module.get(UserService)).toBeInstanceOf(UserService);
  });
});
