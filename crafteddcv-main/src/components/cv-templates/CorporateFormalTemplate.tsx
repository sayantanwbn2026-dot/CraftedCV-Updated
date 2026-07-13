import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const CorporateFormalTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black p-10 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Times New Roman', Georgia, serif", minHeight: "297mm" }}
    >
      {/* Header - Centered */}
      <header className="text-center pb-6 mb-6 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-black uppercase tracking-widest">
          {formData.firstName} {formData.lastName}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-600">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>|</span>}
          {formData.phone && <span>{formData.phone}</span>}
          {formData.location && <span>|</span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
          {formData.linkedin && <span>{formData.linkedin}</span>}
          {formData.portfolio && <span>|</span>}
          {formData.portfolio && <span>{formData.portfolio}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {formData.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-gray-300 pb-2 mb-3">
            Executive Summary
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed text-justify">{formData.summary}</p>
        </section>
      )}

      {/* Professional Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-black">{exp.position}</h3>
                  <span className="text-sm text-gray-600 italic">
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                <p className="text-sm text-gray-700 italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
                {exp.description && (
                  <p className="mt-2 text-sm text-gray-800 whitespace-pre-line text-justify">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {formData.education.some((e) => e.institution) && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
            Education
          </h2>
          <div className="space-y-3">
            {formData.education
              .filter((edu) => edu.institution)
              .map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-black">{edu.institution}</h3>
                    <p className="text-sm text-gray-700 italic">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 italic">
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {formData.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
            Key Projects
          </h2>
          <div className="space-y-3">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-bold text-black">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-800 text-justify">{project.description}</p>
                )}
                {project.technologies && (
                  <p className="text-xs text-gray-600 mt-1 italic">Technologies: {project.technologies}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-gray-300 pb-2 mb-3">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {skillsList.map((skill, index) => (
              <span key={index} className="text-sm text-gray-700">• {skill}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CorporateFormalTemplate;
