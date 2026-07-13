import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const AcademicScholarTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black p-10 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Cambria', 'Georgia', serif", minHeight: "297mm" }}
    >
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-normal text-black">
          {formData.firstName} {formData.lastName}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-700">
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>
        <div className="border-b border-black mt-4" />
      </header>

      {/* Education - First for academic CV */}
      {formData.education.some((e) => e.institution) && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-black mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {formData.education
              .filter((edu) => edu.institution)
              .map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-black">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Summary / Research Interests */}
      {formData.summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-black mb-3">
            Research Interests
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed text-justify">{formData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-black mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-black">{exp.position}</h3>
                    <p className="text-sm text-gray-700">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                {exp.description && (
                  <div className="mt-2 text-sm text-gray-800 whitespace-pre-line text-justify">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects / Publications */}
      {formData.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-black mb-3">
            Projects & Publications
          </h2>
          <div className="space-y-3">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{project.name}</span>
                  {project.description && `. ${project.description}`}
                  {project.technologies && (
                    <span className="text-gray-600"> [{project.technologies}]</span>
                  )}
                  {project.link && (
                    <span className="text-gray-600 italic"> Available at: {project.link}</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-black mb-3">
            Skills & Expertise
          </h2>
          <p className="text-sm text-gray-800">{skillsList.join(", ")}</p>
        </section>
      )}
    </div>
  );
};

export default AcademicScholarTemplate;
