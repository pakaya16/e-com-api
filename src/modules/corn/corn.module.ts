import { Module } from "@nestjs/common";
import { CornController } from "./corn.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule],
  controllers: [CornController],
  providers: [],
  exports: []
})
export class CornModule {
}
