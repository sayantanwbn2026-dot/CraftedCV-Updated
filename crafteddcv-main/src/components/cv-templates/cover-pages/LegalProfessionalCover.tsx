import { CVFormData } from "../types";
const LegalProfessionalCover = ({ formData }: { formData: CVFormData }) => (
  <div className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center" style={{ fontFamily: "'Georgia', serif", height: "297mm", pageBreakAfter: "always" }}>
    <div className="max-w-sm text-center">
      <h1 className="text-4xl font-bold text-black tracking-tight mb-2">{formData.firstName} {formData.lastName}</h1>
      <div className="w-full h-px bg-black my-6" />
      <div className="w-full h-0.5 bg-black mb-6" />
      <p className="text-lg text-gray-500">Cover Letter</p>
      <div className="mt-10 space-y-1.5 text-sm text-gray-500">
        {formData.email && <p>{formData.email}</p>}
        {formData.phone && <p>{formData.phone}</p>}
        {formData.location && <p>{formData.location}</p>}
      </div>
    </div>
  </div>
);
export default LegalProfessionalCover;
