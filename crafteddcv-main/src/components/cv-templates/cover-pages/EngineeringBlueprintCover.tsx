import { CVFormData } from "../types";
const EngineeringBlueprintCover = ({ formData }: { formData: CVFormData }) => (
  <div className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center" style={{ fontFamily: "'Courier New', monospace", height: "297mm", pageBreakAfter: "always" }}>
    <div className="border-2 border-black p-10 text-center">
      <p className="text-xs text-gray-400 mb-4">{"// COVER_LETTER"}</p>
      <h1 className="text-3xl font-bold text-black mb-2">{formData.firstName} {formData.lastName}</h1>
      <div className="w-16 h-px bg-gray-400 mx-auto my-4" />
      <div className="space-y-1 text-xs text-gray-500">
        {formData.email && <p>{formData.email}</p>}
        {formData.phone && <p>{formData.phone}</p>}
        {formData.location && <p>{formData.location}</p>}
      </div>
    </div>
  </div>
);
export default EngineeringBlueprintCover;
