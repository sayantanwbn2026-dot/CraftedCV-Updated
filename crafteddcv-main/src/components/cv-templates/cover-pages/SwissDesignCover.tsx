import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const SwissDesignCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Helvetica', 'Arial', sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Swiss grid cover */}
      <div className="grid grid-cols-12 gap-0 h-full">
        {/* Black column */}
        <div className="col-span-4 bg-black flex flex-col justify-end p-8">
          <h1 className="text-3xl font-bold text-white leading-tight">
            {formData.firstName}
            <br />
            {formData.lastName}
          </h1>
        </div>
        
        {/* White column */}
        <div className="col-span-8 flex flex-col justify-between p-8">
          <div>
            <p className="text-xs font-bold text-black uppercase tracking-[0.3em]">
              Document
            </p>
          </div>
          
          <div>
            <h2 className="text-5xl font-bold text-black">
              Cover
            </h2>
            <h2 className="text-5xl font-bold text-gray-300">
              Letter
            </h2>
          </div>
          
          <div className="space-y-1 text-sm text-gray-500">
            {formData.email && <p>{formData.email}</p>}
            {formData.phone && <p>{formData.phone}</p>}
            {formData.location && <p>{formData.location}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwissDesignCover;
