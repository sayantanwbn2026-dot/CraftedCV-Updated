import { Mail, Phone, MapPin, Linkedin, Globe, Code, Briefcase, GraduationCap } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const DataDrivenTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Roboto Mono', monospace", minHeight: "297mm" }}
    >
      {/* Header with code-like styling */}
      <header className="bg-gray-900 text-green-400 p-6">
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="text-gray-500">{"// "}</span>
          <span>developer.profile</span>
        </div>
        <h1 className="text-3xl font-bold text-white">
          {formData.firstName} {formData.lastName}
        </h1>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-300">
          {formData.email && <span><span className="text-gray-500">email:</span> "{formData.email}"</span>}
          {formData.phone && <span><span className="text-gray-500">phone:</span> "{formData.phone}"</span>}
          {formData.location && <span><span className="text-gray-500">location:</span> "{formData.location}"</span>}
          {formData.linkedin && <span><span className="text-gray-500">linkedin:</span> "{formData.linkedin}"</span>}
          {formData.portfolio && <span><span className="text-gray-500">portfolio:</span> "{formData.portfolio}"</span>}
        </div>
      </header>

      <div className="p-8">
        {/* Summary */}
        {formData.summary && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-sm">//</span>
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">README.md</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-4">{formData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {formData.experience.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 shrink-0 text-gray-400" size={16} width={16} height={16} preserveAspectRatio="xMidYMid meet" />
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">work.log</h2>
            </div>
            <div className="space-y-4">
              {formData.experience.map((exp, idx) => (
                <div key={exp.id} className="bg-gray-50 p-4 rounded border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-gray-400">[{idx}]</span>
                      <h3 className="font-bold text-black">{exp.position}</h3>
                      <p className="text-sm text-gray-600">{exp.company}{exp.location && ` @ ${exp.location}`}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {formatDate(exp.startDate)} → {exp.endDate ? formatDate(exp.endDate) : "current"}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {formData.education.some((e) => e.institution) && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 shrink-0 text-gray-400" size={16} width={16} height={16} preserveAspectRatio="xMidYMid meet" />
                <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">education.json</h2>
              </div>
              <div className="space-y-3">
                {formData.education
                  .filter((edu) => edu.institution)
                  .map((edu) => (
                    <div key={edu.id} className="border-l-2 border-gray-300 pl-3">
                      <h3 className="font-bold text-black text-sm">{edu.institution}</h3>
                      <p className="text-xs text-gray-600">
                        {edu.degree} {edu.field && `→ ${edu.field}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skillsList.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">stack.config</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono border border-gray-200 rounded"
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
          <section className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400 text-sm">$</span>
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">projects/</h2>
            </div>
            <div className="space-y-3">
              {formData.projects.map((project) => (
                <div key={project.id} className="flex gap-4 items-start">
                  <span className="text-gray-400 text-sm">→</span>
                  <div>
                    <h3 className="font-bold text-black text-sm">{project.name}</h3>
                    {project.description && (
                      <p className="text-xs text-gray-600">{project.description}</p>
                    )}
                    {project.technologies && (
                      <p className="text-xs text-gray-400 mt-1">deps: [{project.technologies}]</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DataDrivenTemplate;
