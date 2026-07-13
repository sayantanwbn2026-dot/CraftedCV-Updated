import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const ExecutiveEliteCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center p-16"
      style={{ fontFamily: "'Georgia', serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Elegant top ornament */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 text-gray-300">
          <div className="w-16 h-px bg-gray-300" />
          <span className="text-2xl">✦</span>
          <div className="w-16 h-px bg-gray-300" />
        </div>
      </div>
      
      {/* Name in elegant serif */}
      <h1 className="text-5xl font-normal text-black text-center tracking-wide">
        {formData.firstName} {formData.lastName}
      </h1>
      
      {/* Double border separator */}
      <div className="w-64 my-12">
        <div className="border-t-4 border-double border-black" />
      </div>
      
      <p className="text-xl tracking-[0.5em] uppercase text-gray-500 mb-4">
        Cover Letter
      </p>
      
      <p className="text-sm italic text-gray-400 text-center max-w-md mt-8">
        {formData.summary ? formData.summary.slice(0, 150) + (formData.summary.length > 150 ? '...' : '') : 'Professional correspondence enclosed'}
      </p>
      
      {/* Contact info in elegant style */}
      <div className="mt-16 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-6">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>{formData.phone}</span>}
        </div>
        {formData.location && <p className="mt-2">{formData.location}</p>}
      </div>
      
      {/* Bottom ornament */}
      <div className="mt-auto text-center">
        <div className="flex items-center justify-center gap-4 text-gray-300">
          <div className="w-16 h-px bg-gray-300" />
          <span className="text-2xl">✦</span>
          <div className="w-16 h-px bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveEliteCover;
