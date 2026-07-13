import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const CleanGridTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black p-8 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", minHeight: "297mm" }}
    >
      {/* Header - Two Column */}
      <header className="grid grid-cols-2 gap-8 pb-6 mb-6 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-light text-black tracking-tight">
            {formData.firstName}
          </h1>
          <h1 className="text-4xl font-bold text-black tracking-tight">
            {formData.lastName}
          </h1>
        </div>
        <div className="flex flex-col justify-center text-right text-sm text-gray-600 space-y-1">
          {formData.email && <p>{formData.email}</p>}
          {formData.phone && <p>{formData.phone}</p>}
          {formData.location && <p>{formData.location}</p>}
          {formData.linkedin && <p>{formData.linkedin}</p>}
          {formData.portfolio && <p>{formData.portfolio}</p>}
        </div>
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Profile
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{formData.summary}</p>
        </section>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Experience & Education */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {formData.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Experience
              </h2>
              <div className="space-y-5">
                {formData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-black">{exp.position}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {formData.projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Projects
              </h2>
              <div className="space-y-4">
                {formData.projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-semibold text-black">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                    )}
                    {project.technologies && (
                      <p className="text-xs text-gray-500 mt-1">{project.technologies}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Education & Skills */}
        <div className="space-y-6">
          {/* Education */}
          {formData.education.some((e) => e.institution) && (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Education
              </h2>
              <div className="space-y-3">
                {formData.education
                  .filter((edu) => edu.institution)
                  .map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-black text-sm">{edu.institution}</h3>
                      <p className="text-xs text-gray-600">
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
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Skills
              </h2>
              <div className="space-y-1">
                {skillsList.map((skill, index) => (
                  <p key={index} className="text-sm text-gray-700">{skill}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanGridTemplate;
