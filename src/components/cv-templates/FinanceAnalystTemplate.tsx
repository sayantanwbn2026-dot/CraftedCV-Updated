import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const FinanceAnalystTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  const contentItems =
    formData.experience.length +
    formData.education.filter(e => e.institution).length +
    formData.projects.length;

  const hasLongContent =
    formData.summary.length > 300 ||
    formData.experience.some(exp => exp.description.length > 200) ||
    contentItems > 6;

  const fs = hasLongContent
    ? { name: "text-2xl", section: "text-base", body: "text-xs", small: "text-[10px]" }
    : { name: "text-3xl", section: "text-lg", body: "text-sm", small: "text-xs" };

  return (
    <div
      className="bg-white text-black p-7 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Calibri', sans-serif", height: "297mm", maxHeight: "297mm", overflow: "hidden", boxSizing: "border-box" }}
    >
      {/* Header */}
      <header className="mb-4">
        <h1 className={`${fs.name} font-bold text-black`}>{formData.firstName} {formData.lastName}</h1>
        <div className="h-0.5 bg-gray-300 my-2" />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600" style={{ fontSize: hasLongContent ? "10px" : "11px" }}>
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-semibold text-black border-b-2 border-black pb-0.5 mb-2`}>Summary</h2>
          <p className={`${fs.body} text-gray-800 leading-snug`}>{formData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-semibold text-black border-b-2 border-black pb-0.5 mb-2`}>Professional Experience</h2>
          <div className="space-y-2">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className={`font-semibold text-black ${fs.body}`}>{exp.position}</h3>
                    <p className={`${fs.small} text-gray-600`}>{exp.company}{exp.location && ` — ${exp.location}`}</p>
                  </div>
                  <span className={`${fs.small} text-gray-500 flex-shrink-0`}>
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                {exp.description && (
                  <div className={`mt-1 ${fs.body} text-gray-700 whitespace-pre-line leading-snug`}>{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills side by side for compactness */}
      <div className="flex gap-6">
        {/* Education */}
        {formData.education.some((e) => e.institution) && (
          <section className="mb-3 flex-1">
            <h2 className={`${fs.section} font-semibold text-black border-b-2 border-black pb-0.5 mb-2`}>Education</h2>
            <div className="space-y-1">
              {formData.education.filter((edu) => edu.institution).map((edu) => (
                <div key={edu.id}>
                  <h3 className={`font-semibold text-black ${fs.body}`}>{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className={`${fs.small} text-gray-600`}>{edu.institution}</p>
                  <p className={`${fs.small} text-gray-400`}>{formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skillsList.length > 0 && (
          <section className="mb-3 flex-1">
            <h2 className={`${fs.section} font-semibold text-black border-b-2 border-black pb-0.5 mb-2`}>Core Competencies</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {skillsList.map((skill, i) => (
                <span key={i} className={`${fs.small} text-gray-800`}>• {skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {formData.projects.length > 0 && (
        <section>
          <h2 className={`${fs.section} font-semibold text-black border-b-2 border-black pb-0.5 mb-2`}>Key Projects</h2>
          <div className="space-y-1">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold text-black ${fs.body}`}>{project.name}</h3>
                  {project.link && <span className={`${fs.small} text-gray-500`}>{project.link}</span>}
                </div>
                {project.description && <p className={`${fs.body} text-gray-700 mt-0.5 leading-snug`}>{project.description}</p>}
                {project.technologies && <p className={`${fs.small} text-gray-500 mt-0.5`}><span className="font-semibold">Tools:</span> {project.technologies}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FinanceAnalystTemplate;
