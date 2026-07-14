import jsPDF from "jspdf";

export type DiplomaData = {
  studentName: string;
  examCode: string;
  level: string;
  date: string;
  scores: { label: string; score: number; max: number }[];
  cefrEstimated: string;
  totalScore: number;
  totalMax: number;
};

export function generateDiplomaPdf(d: DiplomaData): Blob {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background border
  doc.setDrawColor(30, 60, 180);
  doc.setLineWidth(2);
  doc.rect(8, 8, w - 16, h - 16);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, w - 24, h - 24);

  // Header
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 60, 180);
  doc.setFontSize(28);
  doc.text("Professeur.fr", w / 2, 28, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  doc.text("Attestation de simulacre officiel", w / 2, 38, { align: "center" });

  // Body
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text("Décerné à", w / 2, 58, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(20, 20, 20);
  doc.text(d.studentName, w / 2, 72, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(
    `Pour avoir complété le simulacre ${d.examCode} — ${d.level}`,
    w / 2,
    84,
    { align: "center" },
  );

  // Scores table
  const startY = 100;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 60, 180);
  doc.text("Résultats par épreuve", 40, startY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(11);
  d.scores.forEach((s, i) => {
    const y = startY + 8 + i * 8;
    doc.text(s.label, 40, y);
    doc.text(`${s.score} / ${s.max}`, w - 40, y, { align: "right" });
  });

  // Total & CEFR
  const totalY = startY + 8 + d.scores.length * 8 + 12;
  doc.setDrawColor(200, 200, 200);
  doc.line(40, totalY - 4, w - 40, totalY - 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 60, 180);
  doc.text("Total", 40, totalY + 2);
  doc.text(`${d.totalScore} / ${d.totalMax}`, w - 40, totalY + 2, { align: "right" });

  doc.setFontSize(18);
  doc.setTextColor(20, 100, 40);
  doc.text(`Niveau CECRL estimé : ${d.cefrEstimated}`, w / 2, totalY + 18, {
    align: "center",
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Ce document est un simulacre à but pédagogique et n'a pas de valeur officielle.",
    w / 2,
    h - 22,
    { align: "center" },
  );
  doc.setFont("helvetica", "normal");
  doc.text(`Délivré le ${d.date}`, w / 2, h - 16, { align: "center" });

  return doc.output("blob");
}
