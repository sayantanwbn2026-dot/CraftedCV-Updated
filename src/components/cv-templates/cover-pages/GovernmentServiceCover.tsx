import { CVFormData } from "../types";
const GovernmentServiceCover = ({ formData }: { formData: CVFormData }) => (
  <div className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center" style={{ fontFamily: "'Times New Roman', serif", height: "297mm", pageBreakAfter: "always" }}>
    <div className="text-center">
      <p className="text-sm text-gray-500 uppercase tracking-[0.3em] mb-8">Cover Letter</p>
      <div className="border-t-2 border-b-2 border-black py-8 px-12">
        <h1 className="text-4xl font-bold text-black uppercase tracking-wider mb-2">{formData.firstName} {formData.lastName}</h1>
      </div>
      <div className="mt-10 space-y-1.5 text-sm text-gray-600">
        {formData.email && <p>{formData.email}</p>}
        {formData.phone && <p>{formData.phone}</p>}
        {formData.location && <p>{formData.location}</p>}
      </div>
    </div>
  </div>
);
export default GovernmentServiceCover;
