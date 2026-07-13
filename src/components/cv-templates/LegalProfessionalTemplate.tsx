import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const LegalProfessionalTemplate = ({ formData }: CVTemplateProps) => {
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
      className="bg-white text-black p-8 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Georgia', serif", height: "297mm", maxHeight: "297mm", overflow: "hidden", boxSizing: "border-box" }}
    >
      {/* Header */}
      <header className="mb-4">
        <h1 className={`${fs.name} font-bold text-black tracking-tight`}>
          {formData.firstName} {formData.lastName}
        </h1>
        <div className="w-full h-px bg-black mt-2 mb-2" />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-700" style={{ fontSize: hasLongContent ? "10px" : "12px" }}>
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>
        <div className="w-full h-0.5 bg-black mt-2" />
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black mb-1`}>Professional Profile</h2>
          <p className={`${fs.body} text-gray-800 leading-snug`}>{formData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black border-b border-gray-300 pb-1 mb-2`}>Professional Experience</h2>
          <div className="space-y-2">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-bold text-black ${fs.body}`}>{exp.position}</h3>
                  <span className={`${fs.small} text-gray-600 flex-shrink-0 italic`}>
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                <p className={`${fs.small} text-gray-700`}>{exp.company}{exp.location && ` | ${exp.location}`}</p>
                {exp.description && (
                  <div className={`mt-1 ${fs.body} text-gray-800 whitespace-pre-line leading-snug`}>{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {formData.education.some((e) => e.institution) && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black border-b border-gray-300 pb-1 mb-2`}>Education</h2>
          <div className="space-y-1">
            {formData.education.filter((edu) => edu.institution).map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className={`font-bold text-black ${fs.body}`}>{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className={`${fs.small} text-gray-700 italic`}>{edu.institution}</p>
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
          <h2 className={`${fs.section} font-bold text-black border-b border-gray-300 pb-1 mb-2`}>Notable Cases & Projects</h2>
          <div className="space-y-1">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <h3 className={`font-bold text-black ${fs.body}`}>{project.name}</h3>
                {project.description && <p className={`${fs.body} text-gray-800 mt-0.5 leading-snug`}>{project.description}</p>}
                {project.technologies && <p className={`${fs.small} text-gray-600 mt-0.5`}><span className="font-bold">Areas:</span> {project.technologies}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className={`${fs.section} font-bold text-black border-b border-gray-300 pb-1 mb-2`}>Areas of Expertise</h2>
          <div className="flex flex-wrap gap-x-1">
            {skillsList.map((skill, index) => (
              <span key={index} className={`${fs.body} text-gray-800`}>
                {skill}{index < skillsList.length - 1 ? " | " : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default LegalProfessionalTemplate;
