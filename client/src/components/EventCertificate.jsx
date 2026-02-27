import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function EventCertificate({ studentName, eventName, date }) {
  const certificateRef = useRef();

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, { scale: 3 }); // High quality
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${eventName}-Certificate.pdf`);
  };

  return (
    <div className="flex flex-col items-center">
      {/* 🟢 THE DESIGN (What the PDF will look like) */}
      <div 
        ref={certificateRef}
        className="w-[842px] h-[595px] bg-white border-[16px] border-black p-12 flex flex-col items-center justify-between relative overflow-hidden"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {/* Memphis Decorations */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#ff6b35] rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 border-[8px] border-black rounded-full"></div>
        
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-4 h-4 bg-[#ff6b35] rounded-full"></div>
            <p className="text-2xl font-black tracking-tighter uppercase">Hubble</p>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-[0.2em] text-black">Certificate</h1>
          <p className="text-lg font-bold text-[#ff6b35] mt-2 uppercase tracking-widest">Of Completion</p>
        </div>

        {/* Body */}
        <div className="text-center space-y-6">
          <p className="text-xl font-medium text-gray-500 italic">This is proudly presented to</p>
          <h2 className="text-6xl font-black text-black border-b-8 border-black pb-2 px-10 inline-block">
            {studentName}
          </h2>
          <p className="text-xl font-bold text-gray-700 max-w-xl mx-auto leading-relaxed">
            For successfully completing the mission: <br/>
            <span className="text-[#ff6b35] font-black underline">{eventName}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-end">
          <div className="text-left">
            <p className="text-xs font-black text-gray-400 uppercase">Issue Date</p>
            <p className="text-lg font-bold text-black">{date}</p>
          </div>
          <div className="text-center">
             <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center rotate-12 mb-2">
                <p className="text-[10px] font-black uppercase leading-tight">Verified by<br/>Hubble</p>
             </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 uppercase">Verification ID</p>
            <p className="text-[10px] font-mono font-bold text-black">HUB-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={downloadCertificate}
        className="mt-8 bg-black text-white px-8 py-3 rounded-xl font-black shadow-[6px_6px_0px_0px_rgba(255,107,53,1)] hover:-translate-y-1 transition-all"
      >
        Download Certificate (PDF)
      </button>
    </div>
  );
}