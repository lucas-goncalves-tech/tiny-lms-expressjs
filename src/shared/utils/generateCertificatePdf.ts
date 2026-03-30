import { jsPDF } from "jspdf";
import { ICertificateFull } from "../../features/certificates/interfaces/certificates.interface";

function formatDuration(totalSeconds: number | null): string {
  if (!totalSeconds) return "0 horas";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes} minutos`;
  if (minutes === 0) return `${hours} hora${hours > 1 ? "s" : ""}`;
  return `${hours}h ${minutes}min`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return new Date().toLocaleDateString("pt-BR");
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function generateCertificatePdf(certificate: ICertificateFull) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // === CORES ===
  const primaryColor: [number, number, number] = [41, 98, 255]; // Azul vibrante
  const goldColor: [number, number, number] = [212, 175, 55]; // Dourado
  const darkText: [number, number, number] = [33, 37, 41];
  const lightText: [number, number, number] = [108, 117, 125];

  // === FUNDO GRADIENTE SUTIL ===
  doc.setFillColor(250, 251, 252);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // === BORDA EXTERNA ELEGANTE ===
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // === BORDA INTERNA DOURADA ===
  doc.setDrawColor(...goldColor);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // === ELEMENTOS DECORATIVOS NOS CANTOS ===
  const cornerSize = 15;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1.5);

  // Canto superior esquerdo
  doc.line(8, 23, 8 + cornerSize, 23);
  doc.line(23, 8, 23, 8 + cornerSize);

  // Canto superior direito
  doc.line(pageWidth - 8 - cornerSize, 23, pageWidth - 8, 23);
  doc.line(pageWidth - 23, 8, pageWidth - 23, 8 + cornerSize);

  // Canto inferior esquerdo
  doc.line(8, pageHeight - 23, 8 + cornerSize, pageHeight - 23);
  doc.line(23, pageHeight - 8 - cornerSize, 23, pageHeight - 8);

  // Canto inferior direito
  doc.line(pageWidth - 8 - cornerSize, pageHeight - 23, pageWidth - 8, pageHeight - 23);
  doc.line(pageWidth - 23, pageHeight - 8 - cornerSize, pageWidth - 23, pageHeight - 8);

  // === TÍTULO "CERTIFICADO" ===
  doc.setTextColor(...primaryColor);
  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICADO", pageWidth / 2, 45, { align: "center" });

  // === LINHA DECORATIVA ABAIXO DO TÍTULO ===
  doc.setDrawColor(...goldColor);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 50, 52, pageWidth / 2 + 50, 52);

  // === SUBTÍTULO ===
  doc.setTextColor(...lightText);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Este certificado é orgulhosamente concedido a", pageWidth / 2, 70, { align: "center" });

  // === NOME DO ALUNO ===
  doc.setTextColor(...darkText);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.name ?? "Aluno", pageWidth / 2, 90, { align: "center" });

  // === LINHA ABAIXO DO NOME ===
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 70, 96, pageWidth / 2 + 70, 96);

  // === TEXTO DE CONCLUSÃO ===
  doc.setTextColor(...lightText);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("por concluir com sucesso o curso", pageWidth / 2, 112, { align: "center" });

  // === NOME DO CURSO ===
  doc.setTextColor(...primaryColor);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.title ?? "Curso", pageWidth / 2, 128, { align: "center" });

  // === DETALHES DO CURSO ===
  doc.setTextColor(...lightText);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const totalSecondsDouble = (certificate.totalSeconds ?? 0) * 2;
  const details = `${certificate.totalLessons ?? 0} aulas • ${formatDuration(totalSecondsDouble)}`;
  doc.text(details, pageWidth / 2, 140, { align: "center" });

  // === DATA DE CONCLUSÃO ===
  doc.setTextColor(...darkText);
  doc.setFontSize(12);
  doc.text(`Concluído em ${formatDate(certificate.completed)}`, pageWidth / 2, 155, {
    align: "center",
  });

  // === SELO DE AUTENTICIDADE ===
  const sealX = pageWidth - 55;
  const sealY = pageHeight - 45;

  // Círculo externo
  doc.setDrawColor(...goldColor);
  doc.setLineWidth(2);
  doc.circle(sealX, sealY, 18);

  // Círculo interno
  doc.setLineWidth(0.5);
  doc.circle(sealX, sealY, 14);

  // Texto do selo
  doc.setTextColor(...goldColor);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("VERIFICADO", sealX, sealY - 3, { align: "center" });
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("AUTÊNTICO", sealX, sealY + 3, { align: "center" });

  // === ID DO CERTIFICADO ===
  doc.setTextColor(...lightText);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`ID: ${certificate.id}`, 20, pageHeight - 15);

  return Buffer.from(doc.output("arraybuffer"));
}
