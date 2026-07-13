import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const ExecutiveEliteTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black p-10 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Georgia', serif", minHeight: "297mm" }}
    >
      {/* Header */}
      <header className="mb-8 pb-6 border-b-4 border-double border-black">
        <h1 className="text-4xl font-normal text-black text-center tracking-wide">
          {formData.firstName} {formData.lastName}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-700">
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-normal text-black uppercase tracking-widest mb-4 text-center">
            Executive Profile
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed text-center italic px-8">
            {formData.summary}
          </p>
        </section>
      )}

      <div className="border-t border-gray-300 my-6" />

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-normal text-black uppercase tracking-widest mb-4 text-center">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                  <div>
                    <h3 className="font-semibold text-black text-lg">{exp.position}</h3>
                    <p className="text-sm text-gray-700">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                {exp.description && (
                  <div className="mt-3 text-sm text-gray-800 whitespace-pre-line leading-relaxed">
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
        <section className="mb-8">
          <h2 className="text-lg font-normal text-black uppercase tracking-widest mb-4 text-center">
            Education
          </h2>
          <div className="space-y-4">
            {formData.education
              .filter((edu) => edu.institution)
              .map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                  <div>
                    <h3 className="font-semibold text-black">{edu.institution}</h3>
                    <p className="text-sm text-gray-700">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {formData.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-normal text-black uppercase tracking-widest mb-4 text-center">
            Notable Projects
          </h2>
          <div className="space-y-4">
            {formData.projects.map((project) => (
              <div key={project.id} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-black">{project.name}</h3>
                  {project.link && (
                    <span className="text-sm text-gray-600">{project.link}</span>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-gray-800 mt-1">{project.description}</p>
                )}
                {project.technologies && (
                  <p className="text-xs text-gray-600 mt-2 italic">
                    {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className="text-lg font-normal text-black uppercase tracking-widest mb-4 text-center">
            Core Competencies
          </h2>
          <div className="text-center">
            <p className="text-sm text-gray-800">{skillsList.join(" • ")}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ExecutiveEliteTemplate;
