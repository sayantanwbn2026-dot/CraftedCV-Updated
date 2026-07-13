import { CVFormData } from "../types";
const MarketingCreativeCover = ({ formData }: { formData: CVFormData }) => (
  <div className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex" style={{ fontFamily: "'Helvetica Neue', sans-serif", height: "297mm", pageBreakAfter: "always" }}>
    <div className="w-[35%] bg-gray-50 flex flex-col justify-center items-center p-8 border-r border-gray-200">
      <div className="w-16 h-1 bg-black mb-6" />
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Cover Letter</p>
    </div>
    <div className="flex-1 flex flex-col justify-center items-center p-8">
      <h1 className="text-5xl font-black text-black leading-tight mb-4">{formData.firstName}<br />{formData.lastName}</h1>
      <div className="mt-8 space-y-1 text-sm text-gray-500 text-center">
        {formData.email && <p>{formData.email}</p>}
        {formData.phone && <p>{formData.phone}</p>}
        {formData.location && <p>{formData.location}</p>}
      </div>
    </div>
  </div>
);
export default MarketingCreativeCover;
