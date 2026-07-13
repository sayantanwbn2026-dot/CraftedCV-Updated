import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const GovernmentServiceTemplate = ({ formData }: CVTemplateProps) => {
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
      className="bg-white text-black p-6 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Times New Roman', serif", height: "297mm", maxHeight: "297mm", overflow: "hidden", boxSizing: "border-box" }}
    >
      {/* Header - Formal centered */}
      <header className="text-center border-b-2 border-black pb-3 mb-4">
        <h1 className={`${fs.name} font-bold text-black uppercase tracking-wider`}>
          {formData.firstName} {formData.lastName}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-gray-700" style={{ fontSize: hasLongContent ? "10px" : "12px" }}>
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
          <h2 className={`${fs.section} font-bold text-black uppercase tracking-wide border-b border-gray-400 pb-1 mb-2`}>
            Professional Summary
          </h2>
          <p className={`${fs.body} text-gray-800 leading-snug`}>{formData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black uppercase tracking-wide border-b border-gray-400 pb-1 mb-2`}>
            Professional Experience
          </h2>
          <div className="space-y-2">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-black ${fs.body}`}>{exp.position}</h3>
                    <p className={`${fs.small} text-gray-700 italic`}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className={`${fs.small} text-gray-600 flex-shrink-0`}>
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                {exp.description && (
                  <div className={`mt-1 ${fs.body} text-gray-800 whitespace-pre-line leading-snug pl-4`}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {formData.education.some((e) => e.institution) && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black uppercase tracking-wide border-b border-gray-400 pb-1 mb-2`}>
            Education
          </h2>
          <div className="space-y-1">
            {formData.education.filter((edu) => edu.institution).map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold text-black ${fs.body}`}>{edu.institution}</h3>
                  <p className={`${fs.small} text-gray-700 italic`}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                </div>
                <span className={`${fs.small} text-gray-600 flex-shrink-0`}>
                  {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {formData.projects.length > 0 && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black uppercase tracking-wide border-b border-gray-400 pb-1 mb-2`}>
            Key Projects
          </h2>
          <div className="space-y-1">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-black ${fs.body}`}>{project.name}</h3>
                  {project.link && <span className={`${fs.small} text-gray-700`}>{project.link}</span>}
                </div>
                {project.description && <p className={`${fs.body} text-gray-800 mt-0.5 leading-snug pl-4`}>{project.description}</p>}
                {project.technologies && <p className={`${fs.small} text-gray-600 mt-0.5 pl-4`}><span className="font-bold">Technologies:</span> {project.technologies}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className={`${fs.section} font-bold text-black uppercase tracking-wide border-b border-gray-400 pb-1 mb-2`}>
            Skills & Competencies
          </h2>
          <p className={`${fs.body} text-gray-800`}>{skillsList.join(" • ")}</p>
        </section>
      )}
    </div>
  );
};

export default GovernmentServiceTemplate;
