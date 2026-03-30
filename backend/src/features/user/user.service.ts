import { UpdatePasswordRequest } from "@lms/dtos";
import { ConflictError } from "../../shared/errors/conflict.error";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { UnprocessableEntityError } from "../../shared/errors/unprocessable-entity.error";
import { CryptoService } from "../../shared/security/crypto-service.security";

import { UserRepository } from "./user.repository";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService
  ) {}

  async updatePassword(userId: string, updatePasswordData: UpdatePasswordRequest) {
    const userExist = await this.userRepository.findByKey("id", userId);
    if (!userExist) throw new UnauthorizedError("Sessão inválida");

    const isPasswordValid = await this.cryptoService.compareHash(
      updatePasswordData.currentPassword,
      userExist.password_hash
    );
    if (!isPasswordValid) throw new UnprocessableEntityError("Senha atual inválida");
    const newHashedPassword = await this.cryptoService.hash(updatePasswordData.newPassword);

    await this.userRepository.update(userExist.id, { password_hash: newHashedPassword });
  }

  async updateEmail(userId: string, newEmail: string) {
    const userExist = await this.userRepository.findByKey("id", userId);
    if (!userExist) throw new UnauthorizedError("Sessão inválida");
    const emailExist = await this.userRepository.findByKey("email", newEmail);
    if (emailExist) throw new ConflictError("Email já está em uso");

    await this.userRepository.update(userExist.id, { email: newEmail });
  }
}
