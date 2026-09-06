import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FileText, Download, Eye, Sparkles } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { CardFolder } from '@/components/ui/CardFolder';
import {
  GoogleCloud3D,
  ClaudeSpark3D,
  Be10xAccelerator3D,
  MYBharatTorch3D,
  ChromeArrow3D,
} from '@/components/ui/FolderGraphics';
import { certificates, portfolioDossier, type Certificate } from '@/data/certificates';
import { DocumentLightbox } from '@/components/ui/DocumentLightbox';
import { stagger, fadeUp } from '@/lib/motion';
import { playClick, playHoverTick } from '@/lib/audio';
import { track } from '@/lib/analytics';

export function CredentialsVault() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const [activeDoc, setActiveDoc] = useState<{
    title: string;
    subtitle?: string;
    issuer?: string;
    date?: string;
    credentialId?: string;
    fileUrl: string;
    fileType?: 'pdf' | 'png';
    accentColor?: string;
  } | null>(null);

  const openCertificate = (cert: Certificate) => {
    playClick();
    track.navClick(`cert_${cert.id}`);
    setActiveDoc({
      title: cert.title,
      subtitle: cert.subtitle,
      issuer: cert.issuer,
      date: cert.date,
      credentialId: cert.credentialId,
      fileUrl: cert.fileUrl,
      fileType: cert.fileType,
      accentColor: cert.accentColor,
    });
  };

  const openDossier = () => {
    playClick();
    track.navClick('portfolio_dossier_vault');
    setActiveDoc({
      title: portfolioDossier.title,
      subtitle: portfolioDossier.subtitle,
      issuer: 'Hardik Bhaskar // Luna Kitsune',
      date: 'v2026.1 • 2 Pages',
      fileUrl: portfolioDossier.fileUrl,
      fileType: 'pdf',
      accentColor: '#00E5FF',
    });
  };

  const folderData = [
    {
      number: '01',
      cert: certificates[0], // Google Cloud
      gradient: 'linear-gradient(145deg, #1E3A8A 0%, #0284C7 40%, #00E5FF 100%)',
      folderBg: '#0B0D19',
      accentColor: '#00E5FF',
      graphic: <GoogleCloud3D className="w-36 h-36" />,
    },
    {
      number: '02',
      cert: certificates[1], // Anthropic Claude
      gradient: 'linear-gradient(145deg, #7C2D12 0%, #EA580C 45%, #FDE68A 100%)',
      folderBg: '#131018',
      accentColor: '#F59E0B',
      graphic: <ClaudeSpark3D className="w-36 h-36" />,
    },
    {
      number: '03',
      cert: certificates[2], // be10x
      gradient: 'linear-gradient(145deg, #064E3B 0%, #059669 45%, #6EE7B7 100%)',
      folderBg: '#0C1310',
      accentColor: '#10B981',
      graphic: <Be10xAccelerator3D className="w-36 h-36" />,
    },
    {
      number: '04',
      cert: certificates[3], // MYBharat
      gradient: 'linear-gradient(145deg, #831843 0%, #D97706 40%, #059669 100%)',
      folderBg: '#141010',
      accentColor: '#F97316',
      graphic: <MYBharatTorch3D className="w-36 h-36" />,
    },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 border-b border-border relative">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-12"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <motion.div variants={fadeUp}>
                <SectionLabel>Verified Credentials</SectionLabel>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-display italic text-heading"
                style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: '0.92' }}
              >
                Card Folder<br />Archives.
              </motion.h2>
            </div>
            <motion.p
              variants={fadeUp}
              className="font-ui text-body text-sm max-w-[440px] leading-relaxed"
            >
              Interactive manila-folder dossiers. Hover any card to slide down the tab notch, revealing the iridescent core and cut-out badge beneath. Click to inspect the verified document.
            </motion.p>
          </div>

          {/* ── Executive Dossier Master Feature Card (Iridescent Chrome Arrow) ── */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0D0E1D] via-[#101226] to-[#0A0B16] border border-cyan/30 overflow-hidden shadow-[0_16px_50px_rgba(0,229,255,0.08)] group"
          >
            {/* Ambient Background Aura */}
            <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-600/15 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-start sm:items-center gap-5">
                {/* 3D Iridescent Chrome Arrow (Signature) */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_10px_25px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-300">
                  <ChromeArrow3D className="w-full h-full" />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-cyan font-bold bg-cyan/10 px-2.5 py-0.5 rounded-full border border-cyan/20 flex items-center gap-1.5">
                      <Sparkles size={11} />
                      EXECUTIVE CANDIDATE DOSSIER
                    </span>
                    <span className="font-mono text-xs text-muted">v2026.1 • 2 Pages • Complete Case Studies</span>
                  </div>

                  <h3 className="font-display italic text-2xl sm:text-3xl text-heading">
                    Hardik Bhaskar — Technical Portfolio PDF
                  </h3>

                  <p className="font-ui text-xs text-body leading-relaxed max-w-2xl">
                    Structured offline dossier detailing bare-metal x86_64 kernel architectures (MahinaOS), native Rust systems (Vectoris), autonomous multi-agent graphs (AEGIS), and local-first AI perception models (Veronica).
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={playHoverTick}
                  onClick={openDossier}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-ui font-semibold text-xs tracking-wide hover:bg-white/90 transition-all shadow-lg"
                >
                  <Eye size={14} />
                  <span>Inspect Dossier</span>
                </motion.button>

                <motion.a
                  href={portfolioDossier.fileUrl}
                  download
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={playHoverTick}
                  onClick={() => {
                    playClick();
                    track.ctaClick('Download Dossier', 'vault');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan/10 hover:bg-cyan/20 text-cyan border border-cyan/30 font-ui font-semibold text-xs tracking-wide transition-all"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* ── 4 Card Folders in Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {folderData.map((item) => (
              <CardFolder
                key={item.cert.id}
                number={item.number}
                title={item.cert.title}
                subtitle={item.cert.subtitle}
                issuer={item.cert.issuerCode}
                badgeText="VERIFIED"
                credentialId={item.cert.credentialId}
                skills={item.cert.skills}
                gradient={item.gradient}
                folderBg={item.folderBg}
                accentColor={item.accentColor}
                graphic={item.graphic}
                onInspect={() => openCertificate(item.cert)}
                onDownload={() => {
                  const link = document.createElement('a');
                  link.href = item.cert.fileUrl;
                  link.download = '';
                  link.click();
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* In-App Lightbox Modal for Document Previews */}
      <DocumentLightbox
        isOpen={activeDoc !== null}
        onClose={() => setActiveDoc(null)}
        document={activeDoc}
      />
    </section>
  );
}
