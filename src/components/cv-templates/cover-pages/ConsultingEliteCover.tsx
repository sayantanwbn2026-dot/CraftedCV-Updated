import { CVFormData } from "../types";
const ConsultingEliteCover = ({ formData }: { formData: CVFormData }) => (
  <div className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center" style={{ fontFamily: "'Garamond', 'Georgia', serif", height: "297mm", pageBreakAfter: "always" }}>
    <div className="text-center">
      <h1 className="text-4xl font-normal text-black tracking-[0.15em] uppercase mb-4">{formData.firstName} {formData.lastName}</h1>
      <div className="flex justify-center items-center gap-2 mb-6">
        <div className="h-px bg-gray-400 w-16" />
        <div className="w-2 h-2 rounded-full bg-black" />
        <div className="h-px bg-gray-400 w-16" />
      </div>
      <p className="text-sm text-gray-500 tracking-[0.2em] uppercase">Cover Letter</p>
      <div className="mt-12 space-y-1.5 text-sm text-gray-500">
        {formData.email && <p>{formData.email}</p>}
        {formData.phone && <p>{formData.phone}</p>}
        {formData.location && <p>{formData.location}</p>}
      </div>
    </div>
  </div>
);
export default ConsultingEliteCover;
