import { CVFormData } from "../types";
const FinanceAnalystCover = ({ formData }: { formData: CVFormData }) => (
  <div className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center" style={{ fontFamily: "'Calibri', sans-serif", height: "297mm", pageBreakAfter: "always" }}>
    <div className="text-center">
      <h1 className="text-4xl font-bold text-black mb-2">{formData.firstName} {formData.lastName}</h1>
      <div className="h-0.5 bg-gray-300 w-48 mx-auto my-4" />
      <p className="text-lg text-gray-500">Cover Letter</p>
      <div className="mt-10 space-y-1.5 text-sm text-gray-500">
        {formData.email && <p>{formData.email}</p>}
        {formData.phone && <p>{formData.phone}</p>}
        {formData.location && <p>{formData.location}</p>}
      </div>
    </div>
  </div>
);
export default FinanceAnalystCover;
