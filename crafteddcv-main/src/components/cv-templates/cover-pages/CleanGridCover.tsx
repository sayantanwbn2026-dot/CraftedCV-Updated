import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const CleanGridCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Two column layout */}
      <div className="flex-1 grid grid-cols-2">
        {/* Left - Name section */}
        <div className="flex flex-col justify-center items-end p-12 border-r border-gray-200">
          <h1 className="text-5xl font-light text-black text-right">
            {formData.firstName}
          </h1>
          <h1 className="text-5xl font-bold text-black text-right">
            {formData.lastName}
          </h1>
        </div>
        
        {/* Right - Cover Letter title */}
        <div className="flex flex-col justify-center items-start p-12">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Document
          </p>
          <p className="text-2xl font-light text-black mt-2">
            Cover Letter
          </p>
          
          {/* Contact info */}
          <div className="mt-12 space-y-1 text-sm text-gray-500">
            {formData.email && <p>{formData.email}</p>}
            {formData.phone && <p>{formData.phone}</p>}
            {formData.location && <p>{formData.location}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanGridCover;
