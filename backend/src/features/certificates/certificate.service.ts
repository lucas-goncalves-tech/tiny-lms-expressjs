import { NotfoundError } from "../../shared/errors/not-found.error";
import { CertificateRepository } from "./certificate.repository";

export class CertificatesService {
  constructor(private readonly certificateRepository: CertificateRepository) {}

  async findManyCertificatesByUserId(userId: string) {
    const result = await this.certificateRepository.findManyCertificatesByUserId(userId);
    return result.map(({ userId: _, totalSeconds, ...certificate }) => ({
      ...certificate,
      totalSeconds: (totalSeconds ?? 0) * 2,
    }));
  }

  async findCertificateById(certificateId: string) {
    const result = await this.certificateRepository.findCertificateById(certificateId);
    if (!result) {
      throw new NotfoundError("Certificado nao encontrado");
    }
    return result;
  }
}
