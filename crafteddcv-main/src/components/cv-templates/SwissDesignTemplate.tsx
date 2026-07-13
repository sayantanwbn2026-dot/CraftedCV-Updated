import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const SwissDesignTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Helvetica', 'Arial', sans-serif", minHeight: "297mm" }}
    >
      {/* Swiss grid header */}
      <header className="grid grid-cols-12 gap-0">
        <div className="col-span-4 bg-black text-white p-8">
          <h1 className="text-2xl font-bold leading-tight">
            {formData.firstName}
            <br />
            {formData.lastName}
          </h1>
        </div>
        <div className="col-span-8 p-8 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            {formData.email && <p>{formData.email}</p>}
            {formData.phone && <p>{formData.phone}</p>}
            {formData.location && <p>{formData.location}</p>}
            {formData.linkedin && <p>{formData.linkedin}</p>}
            {formData.portfolio && <p>{formData.portfolio}</p>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-0">
        {/* Left column - 4 cols */}
        <div className="col-span-4 p-8 bg-gray-50 space-y-8">
          {/* Skills */}
          {skillsList.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-black uppercase tracking-[0.3em] mb-4">
                Skills
              </h2>
              <div className="space-y-2">
                {skillsList.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-px bg-black" />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {formData.education.some((e) => e.institution) && (
            <section>
              <h2 className="text-xs font-bold text-black uppercase tracking-[0.3em] mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {formData.education
                  .filter((edu) => edu.institution)
                  .map((edu) => (
                    <div key={edu.id}>
                      <p className="text-xs text-gray-400 mb-1">
                        {formatDate(edu.startDate)}—{edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </p>
                      <h3 className="font-medium text-black text-sm">{edu.degree}</h3>
                      <p className="text-xs text-gray-600">{edu.field}</p>
                      <p className="text-xs text-gray-500">{edu.institution}</p>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column - 8 cols */}
        <div className="col-span-8 p-8 space-y-8">
          {/* Profile */}
          {formData.summary && (
            <section>
              <h2 className="text-xs font-bold text-black uppercase tracking-[0.3em] mb-4">
                Profile
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{formData.summary}</p>
            </section>
          )}

          {/* Experience */}
          {formData.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-black uppercase tracking-[0.3em] mb-4">
                Experience
              </h2>
              <div className="space-y-6">
                {formData.experience.map((exp) => (
                  <div key={exp.id} className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <p className="text-xs text-gray-400">
                        {formatDate(exp.startDate)}
                        <br />
                        {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <h3 className="font-medium text-black">{exp.position}</h3>
                      <p className="text-sm text-gray-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
                      {exp.description && (
                        <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {formData.projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-black uppercase tracking-[0.3em] mb-4">
                Projects
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {formData.projects.map((project) => (
                  <div key={project.id} className="border-l-2 border-black pl-4">
                    <h3 className="font-medium text-black text-sm">{project.name}</h3>
                    {project.description && (
                      <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                    )}
                    {project.technologies && (
                      <p className="text-xs text-gray-400 mt-1">{project.technologies}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwissDesignTemplate;
