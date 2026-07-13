import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const BoldImpactTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Montserrat', sans-serif", minHeight: "297mm" }}
    >
      {/* Header - Bold block */}
      <header className="bg-black text-white p-10">
        <h1 className="text-4xl font-black uppercase tracking-wider">
          {formData.firstName}
        </h1>
        <h1 className="text-4xl font-black uppercase tracking-wider text-gray-400">
          {formData.lastName}
        </h1>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-300">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>{formData.phone}</span>}
          {formData.location && <span>{formData.location}</span>}
          {formData.linkedin && <span>{formData.linkedin}</span>}
          {formData.portfolio && <span>{formData.portfolio}</span>}
        </div>
      </header>

      <div className="p-10">
        {/* Summary */}
        {formData.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-black uppercase tracking-wider text-black mb-4">
              About
            </h2>
            <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {formData.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-black uppercase tracking-wider text-black mb-4">
              Experience
            </h2>
            <div className="space-y-6">
              {formData.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-black pl-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-black text-lg">{exp.position}</h3>
                    <span className="text-sm font-medium text-gray-500">
                      {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "NOW"}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">{exp.company}{exp.location && ` / ${exp.location}`}</p>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Education */}
          {formData.education.some((e) => e.institution) && (
            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-black mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {formData.education
                  .filter((edu) => edu.institution)
                  .map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-black">{edu.institution}</h3>
                      <p className="text-sm text-gray-600">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skillsList.length > 0 && (
            <section>
              <h2 className="text-xl font-black uppercase tracking-wider text-black mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-black text-white text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects */}
        {formData.projects.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-black uppercase tracking-wider text-black mb-4">
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {formData.projects.map((project) => (
                <div key={project.id} className="border border-black p-4">
                  <h3 className="font-bold text-black">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                  )}
                  {project.technologies && (
                    <p className="text-xs text-gray-500 mt-2 font-medium">{project.technologies}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BoldImpactTemplate;
