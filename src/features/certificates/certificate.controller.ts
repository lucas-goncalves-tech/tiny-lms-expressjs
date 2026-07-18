import { generateCertificatePdf } from "../../shared/utils/generateCertificatePdf";
import { CertificatesService } from "./certificate.service";
import { Request, Response } from "express";
import { CertificateIdParamsRequest } from "./dtos/certificate-params.dto";

export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  findManyCertificatesByUserId = async (req: Request, res: Response) => {
    const userId = req.session!.userId;
    const certificates = await this.certificatesService.findManyCertificatesByUserId(userId);
    res.json(certificates);
  };

  findCertificateById = async (req: Request, res: Response) => {
    const { certificateId } = req.params as CertificateIdParamsRequest;
    const certificate = await this.certificatesService.findCertificateById(certificateId);

    const pdf = generateCertificatePdf(certificate);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificado-${certificate.title}.pdf`
    );
    res.send(pdf);
  };
}
